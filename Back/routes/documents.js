const express = require('express');
const db = require('../db');
const { verifyToken, isAgentOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Ensure documents table exists & auto-seed if empty
async function ensureDocumentsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NULL,
        category VARCHAR(100) DEFAULT 'General',
        file_url VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) DEFAULT 'pdf',
        file_size VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [rows] = await db.query('SELECT COUNT(*) as count FROM documents');
    if (rows[0].count === 0) {
      console.log('Seeding initial documents into database...');
      await db.query(`
        INSERT INTO documents (title, title_hi, category, file_url, file_type, file_size) VALUES
        ('National Swarna Bharat Movement Registration Guidelines 2026', 'राष्ट्रीय स्वर्ण भारत अभियान पंजीकरण दिशा-निर्देश 2026', 'Policy Document', '/uploads/documents/sample_guidelines.pdf', 'pdf', '2.4 MB'),
        ('NGO & Agency Partnership Application Form', 'एनजीओ एवं एजेंसी साझेदारी आवेदन पत्र', 'Application Form', '/uploads/documents/sample_application_form.pdf', 'pdf', '1.1 MB'),
        ('Official Gazette Notification on Youth Skill Initiatives', 'युवा कौशल पहल पर आधिकारिक राजपत्र अधिसूचना', 'Gazette Notification', '/uploads/documents/sample_gazette.pdf', 'pdf', '3.8 MB');
      `);
    }
  } catch (err) {
    console.error('Error ensuring documents table:', err);
  }
}

// GET all documents (public)
router.get('/', async (req, res) => {
  try {
    await ensureDocumentsTable();
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
    await ensureDocumentsTable();
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
    await ensureDocumentsTable();
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
    await ensureDocumentsTable();
    await db.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
