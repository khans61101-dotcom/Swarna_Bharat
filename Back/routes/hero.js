const express = require('express');
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// GET active hero section settings (Public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_settings ORDER BY id DESC LIMIT 1');
    if (rows.length === 0) {
      return res.json({ hero: null });
    }
    res.json({ hero: rows[0] });
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST / PUT update hero section settings (Admin only or authorized)
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
    const [existing] = await db.query('SELECT id FROM hero_settings ORDER BY id DESC LIMIT 1');
    
    if (existing.length > 0) {
      const heroId = existing[0].id;
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
      res.json({ message: 'Hero section updated successfully', id: heroId });
    } else {
      const [result] = await db.query(`
        INSERT INTO hero_settings (video_url, title, title_hi, subtitle, subtitle_hi, badge_text, badge_text_hi, btn1_text, btn1_link, btn2_text, btn2_link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        video_url, title, title_hi, subtitle, subtitle_hi,
        badge_text, badge_text_hi, btn1_text, btn1_link,
        btn2_text, btn2_link
      ]);
      res.json({ message: 'Hero section created successfully', id: result.insertId });
    }
  } catch (error) {
    console.error('Error saving hero settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
