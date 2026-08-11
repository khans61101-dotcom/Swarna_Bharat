const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all active hero section banners (Public, Max 6)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_settings ORDER BY id ASC LIMIT 6');
    res.json({ heroes: rows });
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new hero section banner (Admin, Max 6 limit)
router.post('/', async (req, res) => {
  const {
    video_url,
    title,
    title_hi,
    subtitle,
    subtitle_hi,
    badge_text,
    badge_text_hi,
    btn1_text,
    btn1_link,
    btn2_text,
    btn2_link
  } = req.body;

  try {
    const [[{ count }]] = await db.query('SELECT COUNT(*) as count FROM hero_settings');
    if (count >= 6) {
      return res.status(400).json({ error: 'Maximum limit of 6 Hero Video Banners reached. Delete or edit an existing banner.' });
    }

    const [result] = await db.query(`
      INSERT INTO hero_settings (video_url, title, title_hi, subtitle, subtitle_hi, badge_text, badge_text_hi, btn1_text, btn1_link, btn2_text, btn2_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      video_url || null, title || null, title_hi || null, subtitle || null, subtitle_hi || null,
      badge_text || null, badge_text_hi || null, btn1_text || null, btn1_link || null,
      btn2_text || null, btn2_link || null
    ]);

    res.status(201).json({ message: 'Hero banner created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating hero banner:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update existing hero banner by ID
router.put('/:id', async (req, res) => {
  const heroId = req.params.id;
  const {
    video_url,
    title,
    title_hi,
    subtitle,
    subtitle_hi,
    badge_text,
    badge_text_hi,
    btn1_text,
    btn1_link,
    btn2_text,
    btn2_link
  } = req.body;

  try {
    await db.query(`
      UPDATE hero_settings SET
        video_url = COALESCE(?, video_url),
        title = ?, title_hi = ?,
        subtitle = ?, subtitle_hi = ?,
        badge_text = ?, badge_text_hi = ?,
        btn1_text = ?, btn1_link = ?,
        btn2_text = ?, btn2_link = ?
      WHERE id = ?
    `, [
      video_url, title, title_hi, subtitle, subtitle_hi,
      badge_text, badge_text_hi, btn1_text, btn1_link,
      btn2_text, btn2_link, heroId
    ]);

    res.json({ message: 'Hero banner updated successfully' });
  } catch (error) {
    console.error('Error updating hero banner:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE hero banner by ID
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM hero_settings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Hero banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero banner:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
