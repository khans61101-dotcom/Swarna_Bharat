const express = require('express');
const db = require('../db');
const { verifyToken, isAgentOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// GET all documents (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM documents ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Server error fetching documents' });
  }
});

// GET single document by id
router.get('/:id', async (req, res) => {
  try {
    const [[doc]] = await db.query('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new document (protected - Admin/Agent)
router.post('/', verifyToken, isAgentOrAdmin, async (req, res) => {
  const { title, title_hi, category, file_url, file_type, file_size } = req.body;
  if (!title || !file_url) {
    return res.status(400).json({ error: 'Document title and file URL are required.' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO documents (title, title_hi, category, file_url, file_type, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      title, 
      title_hi || title, 
      category || 'Policy Document', 
      file_url, 
      file_type || 'pdf', 
      file_size || 'N/A'
    ]);

    res.status(201).json({ id: result.insertId, message: 'Document published successfully' });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// DELETE document (protected - Admin/Agent)
router.delete('/:id', verifyToken, isAgentOrAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
