const express = require('express');
const db = require('../db');
const { verifyToken, isAgentOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// GET all enquiries (protected)
router.get('/', verifyToken, isAgentOrAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
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
    const [result] = await db.query(`
      INSERT INTO enquiries (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `, [name, email, phone, subject, message]);
    res.status(201).json({ id: result.insertId, message: 'Enquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE enquiry status (protected)
router.put('/:id', verifyToken, isAgentOrAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
