const express = require('express');
const db = require('../db');
const { verifyToken, isAgentOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// GET all events (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single event by id (public)
router.get('/:id', async (req, res) => {
  try {
    const [[event]] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new event (protected)
router.post('/', verifyToken, isAgentOrAdmin, async (req, res) => {
  const { day, month, year, title, title_hi, location, location_hi, category, category_hi, image, gallery_images, desc, desc_hi } = req.body;
  try {
    const galleryVal = Array.isArray(gallery_images) ? JSON.stringify(gallery_images) : (typeof gallery_images === 'string' ? gallery_images : '[]');
    const [result] = await db.query(`
      INSERT INTO events (day, month, year, title, title_hi, location, location_hi, category, category_hi, image, gallery_images, \`desc\`, desc_hi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [day, month, year, title, title_hi, location, location_hi, category, category_hi, image, galleryVal, desc, desc_hi]);
    res.status(201).json({ id: result.insertId, message: 'Event added successfully' });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE event (protected)
router.delete('/:id', verifyToken, isAgentOrAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
