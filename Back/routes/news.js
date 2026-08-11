const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verifyToken, isAgencyOrNgoOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper to decode token if present (without blocking unauthenticated callers)
function optionalAuth(req) {
  const token = req.headers['authorization'];
  if (!token) return null;
  const tokenPart = token.split(' ')[1] || token;
  try {
    return jwt.verify(tokenPart, process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production');
  } catch (e) {
    return null;
  }
}

// ─── GET all news ────────────────────────────────────────────────────────────
// Public website / Admin -> all news articles
// Agency / NGO          -> only news created by that user/organization
router.get('/', async (req, res) => {
  try {
    const user = optionalAuth(req);

    let query = `
      SELECT n.*, u.name AS creator_name, r.name AS creator_role
      FROM news n
      LEFT JOIN users u ON n.created_by = u.id
      LEFT JOIN roles r ON u.role_id = r.id
    `;
    let params = [];

    // If request comes from an authenticated Agency or NGO user dashboard
    if (user && (user.role === 'Agency' || user.role === 'NGO')) {
      query += ` WHERE n.created_by = ?`;
      params.push(user.id);
    }

    query += ` ORDER BY n.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET single news article by ID ───────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = optionalAuth(req);

    const [rows] = await db.query(`
      SELECT n.*, u.name AS creator_name, r.name AS creator_role
      FROM news n
      LEFT JOIN users u ON n.created_by = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE n.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    const article = rows[0];

    // Non-Admin orgs can only view their own news article details in CMS management
    if (user && (user.role === 'Agency' || user.role === 'NGO') && article.created_by !== user.id) {
      return res.status(403).json({ error: 'Access denied: You can only access your own news articles' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST create new news article (Agency, NGO, Admin) ──────────────────────
router.post('/', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  const { title, title_hi, date, category, category_hi, snippet, snippet_hi, image } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO news (title, title_hi, date, category, category_hi, snippet, snippet_hi, image, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title.trim(),
      title_hi || null,
      date || null,
      category || 'Press Release',
      category_hi || null,
      snippet || null,
      snippet_hi || null,
      image || null,
      req.userId
    ]);

    const [newItem] = await db.query('SELECT * FROM news WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'News article published successfully',
      news: newItem[0]
    });
  } catch (error) {
    console.error('Error publishing news article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT update news article (Agency, NGO, Admin) ────────────────────────────
router.put('/:id', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  const { title, title_hi, date, category, category_hi, snippet, snippet_hi, image } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM news WHERE id = ?', [req.params.id]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    const article = existing[0];

    // Agency / NGO can only update their own news articles
    if (req.userRole !== 'Admin' && article.created_by !== req.userId) {
      return res.status(403).json({ error: 'Access denied: You can only update your own news articles' });
    }

    await db.query(`
      UPDATE news SET
        title       = COALESCE(?, title),
        title_hi    = COALESCE(?, title_hi),
        date        = COALESCE(?, date),
        category    = COALESCE(?, category),
        category_hi = COALESCE(?, category_hi),
        snippet     = COALESCE(?, snippet),
        snippet_hi  = COALESCE(?, snippet_hi),
        image       = COALESCE(?, image)
      WHERE id = ?
    `, [
      title ? title.trim() : null,
      title_hi !== undefined ? title_hi : null,
      date || null,
      category || null,
      category_hi !== undefined ? category_hi : null,
      snippet !== undefined ? snippet : null,
      snippet_hi !== undefined ? snippet_hi : null,
      image || null,
      req.params.id
    ]);

    const [updated] = await db.query('SELECT * FROM news WHERE id = ?', [req.params.id]);

    res.json({
      message: 'News article updated successfully',
      news: updated[0]
    });
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE news article (Agency, NGO, Admin) ────────────────────────────────
router.delete('/:id', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM news WHERE id = ?', [req.params.id]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    const article = existing[0];

    // Agency / NGO can only delete their own news articles
    if (req.userRole !== 'Admin' && article.created_by !== req.userId) {
      return res.status(403).json({ error: 'Access denied: You can only delete your own news articles' });
    }

    await db.query('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
