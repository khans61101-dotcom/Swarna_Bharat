const express = require('express');
const db = require('../db');
const router = express.Router();

// GET public partners list (Users, Members, Agency, NGO)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.address, r.name as role_name, u.city, u.state, u.profile_image,
             o.organization_name, o.logo
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN organization_details o ON u.id = o.user_id
      WHERE r.name IN ('Agency', 'NGO', 'Member', 'User')
      ORDER BY r.name, u.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET specific partner details (downline stats, tasks, media)
router.get('/:id/details', async (req, res) => {
  try {
    const partnerId = req.params.id;

    // 1. Task count (how many tasks assigned to this partner)
    const [[{ taskCount }]] = await db.query('SELECT count(*) as taskCount FROM task_assignments WHERE assigned_to = ?', [partnerId]);
    
    // 2. Downline counts using CTE
    const [downlines] = await db.query(`
      WITH RECURSIVE Downlines AS (
        SELECT id, role_id, created_by, referred_by FROM users WHERE created_by = ? OR referred_by = ?
        UNION ALL
        SELECT u.id, u.role_id, u.created_by, u.referred_by
        FROM users u
        INNER JOIN Downlines d ON u.created_by = d.id OR u.referred_by = d.id
      )
      SELECT d.id, r.name as role_name 
      FROM Downlines d
      JOIN roles r ON d.role_id = r.id
    `, [partnerId, partnerId]);

    const usersCount = downlines.filter(d => d.role_name === 'User').length;
    const membersCount = downlines.filter(d => d.role_name === 'Member').length;

    // 3. Media (Gallery)
    const [media] = await db.query('SELECT * FROM gallery WHERE user_id = ? OR created_by = ? ORDER BY created_at DESC', [partnerId, partnerId]);

    res.json({
      taskCount,
      usersCount,
      membersCount,
      media
    });
  } catch (error) {
    console.error('Error fetching partner details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
