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

// ─── GET all blogs ───────────────────────────────────────────────────────────
// Public / Admin -> all blogs
// Agency / NGO   -> only blogs created by that user/organization
router.get('/', async (req, res) => {
  try {
    const user = optionalAuth(req);

    let query = `
      SELECT b.*, u.name AS creator_name, r.name AS creator_role
      FROM blogs b
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN roles r ON u.role_id = r.id
    `;
    let params = [];

    if (user && (user.role === 'Agency' || user.role === 'NGO')) {
      query += ` WHERE b.created_by = ?`;
      params.push(user.id);
    }

    query += ` ORDER BY b.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET single blog by ID ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = optionalAuth(req);

    const [rows] = await db.query(`
      SELECT b.*, u.name AS creator_name, r.name AS creator_role
      FROM blogs b
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const blog = rows[0];

    // Non-Admin orgs can only view their own blog post details in CMS management
    if (user && (user.role === 'Agency' || user.role === 'NGO') && blog.created_by !== user.id) {
      return res.status(403).json({ error: 'Access denied: You can only access your own blog posts' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST create new blog (Agency, NGO, Admin) ───────────────────────────────
router.post('/', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  const { title, title_hi, author, content, content_hi, image } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Get creator's name if author is empty
    let blogAuthor = author ? author.trim() : null;
    if (!blogAuthor) {
      const [uRows] = await db.query('SELECT name FROM users WHERE id = ?', [req.userId]);
      blogAuthor = uRows.length > 0 ? uRows[0].name : 'Admin';
    }

    const [result] = await db.query(`
      INSERT INTO blogs (title, title_hi, author, content, content_hi, image, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      title.trim(),
      title_hi || null,
      blogAuthor,
      content || null,
      content_hi || null,
      image || null,
      req.userId
    ]);

    const [newBlog] = await db.query('SELECT * FROM blogs WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Blog post created successfully',
      blog: newBlog[0]
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT update blog (Agency, NGO, Admin) ────────────────────────────────────
router.put('/:id', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  const { title, title_hi, author, content, content_hi, image } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const blog = existing[0];

    // Agency / NGO can only update their own blog posts
    if (req.userRole !== 'Admin' && blog.created_by !== req.userId) {
      return res.status(403).json({ error: 'Access denied: You can only update your own blog posts' });
    }

    await db.query(`
      UPDATE blogs SET
        title      = COALESCE(?, title),
        title_hi   = COALESCE(?, title_hi),
        author     = COALESCE(?, author),
        content    = COALESCE(?, content),
        content_hi = COALESCE(?, content_hi),
        image      = COALESCE(?, image)
      WHERE id = ?
    `, [
      title ? title.trim() : null,
      title_hi !== undefined ? title_hi : null,
      author !== undefined ? author : null,
      content !== undefined ? content : null,
      content_hi !== undefined ? content_hi : null,
      image || null,
      req.params.id
    ]);

    const [updated] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Blog post updated successfully',
      blog: updated[0]
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE blog (Agency, NGO, Admin) ─────────────────────────────────────────
router.delete('/:id', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const blog = existing[0];

    // Agency / NGO can only delete their own blog posts
    if (req.userRole !== 'Admin' && blog.created_by !== req.userId) {
      return res.status(403).json({ error: 'Access denied: You can only delete your own blog posts' });
    }

    await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
