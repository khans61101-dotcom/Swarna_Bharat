const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// ── Ensure upload directories exist ────────────────────────────────────────
const uploadDir      = path.join(__dirname, '../public/uploads');
const proofUploadDir = path.join(__dirname, '../public/uploads/proofs');

[uploadDir, proofUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Generic image upload (existing) ────────────────────────────────────────
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

// ── Proof upload (image / PDF) ──────────────────────────────────────────────
const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, proofUploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4', 'video/webm', 'video/quicktime'];

const proofUpload = multer({
  storage: proofStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB for media/proofs
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and videos (MP4/WebM/MOV) are allowed.'), false);
    }
  }
});

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// ── POST /api/upload  ── generic image upload ──────────────────────────────
router.post('/', imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl: `${baseUrl}${fileUrl}`, url: fileUrl });
});

// ── POST /api/upload/multiple  ── multiple image upload ────────────────────
router.post('/multiple', imageUpload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

// ── POST /api/upload/proof  ── task proof upload (image or PDF) ────────────
router.post('/proof', (req, res, next) => {
  proofUpload.single('proof_file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileUrl   = `/uploads/proofs/${req.file.filename}`;
  const publicUrl = `${baseUrl}${fileUrl}`;
  const isImage   = req.file.mimetype.startsWith('image/');

  res.json({
    url:       fileUrl,
    publicUrl,
    filename:  req.file.filename,
    mimetype:  req.file.mimetype,
    size:      req.file.size,
    type:      isImage ? 'image' : 'pdf'
  });
});

// ── Document Upload Storage ──────────────────────────────────────────────
const docUploadDir = path.join(__dirname, '../public/uploads/documents');
if (!fs.existsSync(docUploadDir)) fs.mkdirSync(docUploadDir, { recursive: true });

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, docUploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const docUpload = multer({
  storage: docStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB max
});

// ── POST /api/upload/document  ── document file upload ────────────────────
router.post('/document', docUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No document file uploaded' });
  const fileUrl = `/uploads/documents/${req.file.filename}`;
  const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase();
  const sizeMB = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
  res.json({
    url: fileUrl,
    publicUrl: `${baseUrl}${fileUrl}`,
    file_type: ext || 'pdf',
    file_size: sizeMB,
    originalname: req.file.originalname
  });
});

module.exports = router;
