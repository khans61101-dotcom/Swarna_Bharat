const express = require('express');
const db = require('../db');
const router = express.Router();

// GET public partners list (Users, Members, Agency, NGO)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.address, r.name as role_name, u.city, u.state, u.profile_image, u.cover_image,
             o.organization_name, o.logo
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN organization_details o ON u.id = o.user_id
      WHERE r.name IN ('Agency', 'NGO', 'Member', 'User')
      ORDER BY r.name, u.created_at DESC
    `);
    res.json({ partners: rows });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.json({ partners: [], error: error.message });
  }
});

// GET specific partner details (downline stats, tasks, media)
router.get('/:id/details', async (req, res) => {
  try {
    const partnerId = req.params.id;

    // 1. Task count (how many tasks assigned to this partner)
    const [[{ taskCount }]] = await db.query('SELECT count(*) as taskCount FROM task_assignments WHERE assigned_to = ?', [partnerId]);
    
    // Fetch partner's own referral_code
    const [[partnerUser]] = await db.query('SELECT id, referral_code FROM users WHERE id = ?', [partnerId]);
    const partnerRefCode = partnerUser ? (partnerUser.referral_code || '') : '';

    // 2. Downline counts & full connected network list using CTE
    const [downlines] = await db.query(`
      WITH RECURSIVE Downlines AS (
        SELECT id, name, email, phone, address, city, state, role_id, created_by, referred_by, referral_code, profile_image, created_at 
        FROM users 
        WHERE created_by = ? 
           OR referred_by = ? 
           OR (? != '' AND referred_by IS NOT NULL AND referred_by = ?)
        UNION ALL
        SELECT u.id, u.name, u.email, u.phone, u.address, u.city, u.state, u.role_id, u.created_by, u.referred_by, u.referral_code, u.profile_image, u.created_at
        FROM users u
        INNER JOIN Downlines d ON (
          u.created_by = d.id 
          OR u.referred_by = d.id 
          OR (d.referral_code IS NOT NULL AND d.referral_code != '' AND u.referred_by = d.referral_code)
        )
      )
      SELECT d.*, r.name as role_name 
      FROM Downlines d
      JOIN roles r ON d.role_id = r.id
      ORDER BY d.created_at DESC
    `, [partnerId, partnerId, partnerRefCode, partnerRefCode]);

    const usersCount = downlines.filter(d => d.role_name === 'User').length;
    const membersCount = downlines.filter(d => d.role_name === 'Member').length;

    // 3. Self Media (Gallery items created by this partner)
    const [selfMedia] = await db.query(
      'SELECT * FROM gallery WHERE user_id = ? OR created_by = ? ORDER BY created_at DESC', 
      [partnerId, partnerId]
    );

    // 4. Company Media (Gallery items created by Admin or Global CMS items)
    const [companyMedia] = await db.query(`
      SELECT g.*, u.name AS creator_name, r.name AS creator_role
      FROM gallery g
      LEFT JOIN users u ON (g.created_by = u.id OR g.user_id = u.id)
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE g.created_by IS NULL OR r.name = 'Admin'
      ORDER BY g.created_at DESC
    `);

    res.json({
      taskCount,
      usersCount,
      membersCount,
      downlineUsers: downlines,
      media: selfMedia,
      selfMedia,
      companyMedia
    });
  } catch (error) {
    console.error('Error fetching partner details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
