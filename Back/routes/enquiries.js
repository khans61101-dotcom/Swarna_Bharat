const express = require('express');
const db = require('../db');
const { verifyToken, isAgentOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

async function ensureEnquiriesTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        phone VARCHAR(50) NULL,
        subject VARCHAR(255) NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch (err) {
    console.error('Error ensuring enquiries table:', err);
  }
}

// Auto-run migration
ensureEnquiriesTable();

// GET all enquiries (protected)
router.get('/', verifyToken, isAgentOrAdmin, async (req, res) => {
  try {
    await ensureEnquiriesTable();
    const [rows] = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error getting enquiries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new enquiry (public - for citizens to submit)
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    await ensureEnquiriesTable();
    const [result] = await db.query(`
      INSERT INTO enquiries (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `, [name, email, phone, subject, message]);
    res.status(201).json({ id: result.insertId, message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ error: 'Server error saving enquiry' });
  }
});

// UPDATE enquiry status (protected)
router.put('/:id', verifyToken, isAgentOrAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await ensureEnquiriesTable();
    await db.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE enquiry (protected)
router.delete('/:id', verifyToken, isAgentOrAdmin, async (req, res) => {
  try {
    await ensureEnquiriesTable();
    await db.query('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Server error deleting enquiry' });
  }
});

module.exports = router;
