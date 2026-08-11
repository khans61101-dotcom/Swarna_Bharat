const express = require('express');
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// PUBLIC: Lookup who owns a referral code (used by register page to show referrer info)
router.get('/lookup/:code', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT u.id, u.name, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.referral_code = ?',
      [req.params.code]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Referral code not found' });
    }
    res.json({ valid: true, owner_name: rows[0].name, owner_role: rows[0].role_name });
  } catch (error) {
    console.error('Error looking up referral code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET my referral link, code, and full list of referred users
router.get('/my', verifyToken, async (req, res) => {
  try {
    const [userRows] = await db.query(
      `SELECT u.referral_code, u.referral_link, u.referred_by,
              ref.name as referred_by_name
       FROM users u
       LEFT JOIN users ref ON u.referred_by = ref.id
       WHERE u.id = ?`,
      [req.userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0];

    // Fetch direct referrals (users who have referred_by = req.userId)
    const [referredUsers] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.created_at, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.referred_by = ?
      ORDER BY u.created_at DESC
    `, [req.userId]);

    res.json({
      referral_code: user.referral_code,
      referral_link: user.referral_link,
      referred_by: user.referred_by,
      referred_by_name: user.referred_by_name || null,
      total_referrals: referredUsers.length,
      referred_users: referredUsers
    });
  } catch (error) {
    console.error('Error fetching referral details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET referral statistics and multi-level tree
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const [userRows] = await db.query(
      'SELECT referral_code, referral_link FROM users WHERE id = ?',
      [req.userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Direct count
    const [directRows] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE referred_by = ?',
      [req.userId]
    );

    // Build multi-level referral tree (all users fetched once, then mapped in-memory)
    const [allUsers] = await db.query(`
      SELECT u.id, u.name, u.email, u.referred_by, u.referral_code, u.created_at, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `);

    // Recursively collect downline — hierarchy is immutable (referred_by never changes)
    function getDownline(parentId) {
      const children = allUsers.filter(u => Number(u.referred_by) === Number(parentId));
      return children.map(child => ({
        id: child.id,
        name: child.name,
        email: child.email,
        referral_code: child.referral_code,
        role_name: child.role_name,
        created_at: child.created_at,
        downline: getDownline(child.id)
      }));
    }

    const tree = getDownline(req.userId);

    // Total network size across all levels
    function countNetwork(nodeList) {
      let count = nodeList.length;
      for (const node of nodeList) {
        count += countNetwork(node.downline);
      }
      return count;
    }

    const totalNetworkSize = countNetwork(tree);

    res.json({
      referral_code: userRows[0].referral_code,
      referral_link: userRows[0].referral_link,
      direct_referrals: directRows[0].count || 0,
      total_network_size: totalNetworkSize,
      referral_tree: tree
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

