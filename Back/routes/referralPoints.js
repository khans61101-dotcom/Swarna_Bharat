const express = require('express');
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper: Ensure referral_role_points table and rows exist
async function ensureReferralTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS referral_role_points (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_id INT NOT NULL UNIQUE,
      points INT NOT NULL DEFAULT 50,
      description VARCHAR(255) NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    )
  `);

  const [roles] = await db.query("SELECT * FROM roles WHERE name != 'Admin'");
  const defaults = { 'Agency': 100, 'NGO': 100, 'Agent': 50, 'User': 20, 'Member': 10 };
  for (const role of roles) {
    const defaultPts = defaults[role.name] || 50;
    await db.query(`
      INSERT INTO referral_role_points (role_id, points, description)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE points = points
    `, [role.id, defaultPts, `Referral reward points awarded when a new ${role.name} joins`]);
  }
}

// Initial table check on route load
ensureReferralTable().catch(err => console.error('Error initializing referral table:', err));

// ─── GET all referral role points ─────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    await ensureReferralTable();
    const [rows] = await db.query(`
      SELECT rrp.id, rrp.role_id, r.name as role_name, rrp.points, rrp.description, rrp.updated_at
      FROM referral_role_points rrp
      JOIN roles r ON rrp.role_id = r.id
      ORDER BY rrp.points DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching referral role points:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// ─── PUT update referral points for a role (Admin only) ──────────────────────
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { points, description } = req.body;
  if (points == null || isNaN(points) || parseInt(points) < 0) {
    return res.status(400).json({ error: 'Valid positive points value is required' });
  }

  try {
    await db.query(`
      UPDATE referral_role_points
      SET points = ?, description = COALESCE(?, description)
      WHERE id = ?
    `, [parseInt(points), description || null, req.params.id]);

    const [updated] = await db.query(`
      SELECT rrp.id, rrp.role_id, r.name as role_name, rrp.points, rrp.description, rrp.updated_at
      FROM referral_role_points rrp
      JOIN roles r ON rrp.role_id = r.id
      WHERE rrp.id = ?
    `, [req.params.id]);

    res.json({ message: 'Referral role points updated successfully', data: updated[0] });
  } catch (error) {
    console.error('Error updating referral role points:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

module.exports = router;
