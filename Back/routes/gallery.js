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

// ─── GET all gallery items ───────────────────────────────────────────────────
// Admin / Public -> all gallery items
// Non-Admin logged-in -> only items created by that user
router.get('/', async (req, res) => {
  try {
    const { mine } = req.query;
    const user = optionalAuth(req);

    let query = `
      SELECT g.*, u.name AS creator_name, r.name AS creator_role
      FROM gallery g
      LEFT JOIN users u ON g.created_by = u.id
      LEFT JOIN roles r ON u.role_id = r.id
    `;
    let params = [];

    if (mine === 'true' && user && user.role !== 'Admin') {
      query += ` WHERE g.created_by = ?`;
      params.push(user.id);
    }

    query += ` ORDER BY g.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET single gallery item ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = optionalAuth(req);

    const [rows] = await db.query(`
      SELECT g.*, u.name AS creator_name, r.name AS creator_role
      FROM gallery g
      LEFT JOIN users u ON g.created_by = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE g.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const item = rows[0];

    if (user && user.role !== 'Admin' && item.created_by !== user.id) {
      return res.status(403).json({ error: 'Access denied: You can only access your own gallery items' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST create gallery item (Any authenticated user) ───────────────────────────
router.post('/', verifyToken, async (req, res) => {
  const { src, title, title_hi, category, category_hi, type } = req.body;

  if (!src) {
    return res.status(400).json({ error: 'Image/Video source URL/path (src) is required' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO gallery (src, title, title_hi, category, category_hi, type, created_by, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      src,
      title || null,
      title_hi || null,
      category || 'General',
      category_hi || null,
      type || 'image',
      req.userId,
      req.userId
    ]);

    const [newItem] = await db.query('SELECT * FROM gallery WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Gallery item added successfully',
      item: newItem[0]
    });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT update gallery item (Any authenticated user for their own items) ───────
router.put('/:id', verifyToken, async (req, res) => {
  const { src, title, title_hi, category, category_hi, type } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const item = existing[0];

    // Non-admins can only update their own gallery items
    if (req.userRole !== 'Admin' && item.created_by !== req.userId) {
      return res.status(403).json({ error: 'Access denied: You can only update your own gallery items' });
    }

    await db.query(`
      UPDATE gallery SET
        src         = COALESCE(?, src),
        title       = COALESCE(?, title),
        title_hi    = COALESCE(?, title_hi),
        category    = COALESCE(?, category),
        category_hi = COALESCE(?, category_hi),
        type        = COALESCE(?, type)
      WHERE id = ?
    `, [
      src || null,
      title !== undefined ? title : null,
      title_hi !== undefined ? title_hi : null,
      category || null,
      category_hi !== undefined ? category_hi : null,
      type || null,
      req.params.id
    ]);

    const [updated] = await db.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Gallery item updated successfully',
      item: updated[0]
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE gallery item (Any authenticated user for their own items) ────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const item = existing[0];

    // Non-admins can only delete their own gallery items
    if (req.userRole !== 'Admin' && item.created_by !== req.userId) {
      return res.status(403).json({ error: 'Access denied: You can only delete your own gallery items' });
    }

    await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
