const express = require('express');
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware to ensure user is Agency, NGO, or Admin
const isOrgUserOrAdmin = (req, res, next) => {
  if (req.userRole !== 'Admin' && req.userRole !== 'Agency' && req.userRole !== 'NGO') {
    return res.status(403).json({ error: 'Only Agency and NGO roles can manage organization details' });
  }
  next();
};

// Helper function to calculate organization profile completion percentage
function calculateCompletionPercentage(details) {
  if (!details) return 0;
  const fields = [
    'organization_name', 'organization_type', 'registration_number',
    'gst_number', 'pan_number', 'website', 'logo', 'registration_document',
    'pan_document', 'address', 'city', 'state', 'pincode', 'description'
  ];
  let filled = 0;
  for (const f of fields) {
    if (details[f] && String(details[f]).trim() !== '') {
      filled++;
    }
  }
  return Math.round((filled / fields.length) * 100);
}

// GET logged-in user's organization profile
router.get('/me', verifyToken, isOrgUserOrAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM organization_details o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
    `, [req.userId]);

    if (rows.length === 0) {
      return res.status(200).json({
        message: 'No organization profile found',
        details: null,
        completion_percentage: 0,
        complete: false
      });
    }

    const details = rows[0];
    const pct = calculateCompletionPercentage(details);

    res.json({
      details,
      completion_percentage: pct,
      complete: pct >= 60
    });
  } catch (error) {
    console.error('Error fetching org profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / PUT create or update logged-in user's organization profile
router.post('/me', verifyToken, isOrgUserOrAdmin, async (req, res) => {
  const {
    organization_name, organization_type, registration_number, gst_number,
    pan_number, website, logo, registration_document, pan_document,
    address, city, state, country, pincode, description
  } = req.body;

  try {
    const [existing] = await db.query('SELECT id FROM organization_details WHERE user_id = ?', [req.userId]);

    const orgType = organization_type || req.userRole;
    let targetId;

    if (existing.length > 0) {
      // Update existing record
      targetId = existing[0].id;
      await db.query(`
        UPDATE organization_details SET
          organization_name = ?, organization_type = ?, registration_number = ?,
          gst_number = ?, pan_number = ?, website = ?, logo = COALESCE(?, logo),
          registration_document = COALESCE(?, registration_document),
          pan_document = COALESCE(?, pan_document),
          address = ?, city = ?, state = ?, country = ?, pincode = ?, description = ?
        WHERE user_id = ?
      `, [
        organization_name || null, orgType, registration_number || null,
        gst_number || null, pan_number || null, website || null, logo || null,
        registration_document || null, pan_document || null,
        address || null, city || null, state || null, country || null, pincode || null, description || null,
        req.userId
      ]);
    } else {
      // Insert new record
      const [result] = await db.query(`
        INSERT INTO organization_details (
          user_id, organization_name, organization_type, registration_number,
          gst_number, pan_number, website, logo, registration_document, pan_document,
          address, city, state, country, pincode, description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
      `, [
        req.userId, organization_name || null, orgType, registration_number || null,
        gst_number || null, pan_number || null, website || null, logo || null,
        registration_document || null, pan_document || null,
        address || null, city || null, state || null, country || null, pincode || null, description || null
      ]);
      targetId = result.insertId;
    }

    // Fetch updated details to calculate completion percentage
    const [updatedRows] = await db.query('SELECT * FROM organization_details WHERE user_id = ?', [req.userId]);
    const pct = calculateCompletionPercentage(updatedRows[0]);

    return res.json({
      message: 'Organization profile saved successfully',
      id: targetId,
      completion_percentage: pct,
      complete: pct >= 60
    });
  } catch (error) {
    console.error('Error saving org profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all organization profiles (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone,
             approver.name as approved_by_name
      FROM organization_details o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN users approver ON o.approved_by = approver.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orgs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET organization profile by ID
router.get('/:id', verifyToken, isOrgUserOrAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone,
             approver.name as approved_by_name
      FROM organization_details o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN users approver ON o.approved_by = approver.id
      WHERE o.id = ? OR o.user_id = ?
    `, [req.params.id, req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Organization profile not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching org:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update organization status (Admin only: Approve/Reject)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value. Must be Approved, Rejected, or Pending' });
  }

  try {
    const isApproved = status === 'Approved';
    await db.query(`
      UPDATE organization_details SET
        status = ?,
        approved_by = ?,
        approved_at = ?
      WHERE id = ?
    `, [status, isApproved ? req.userId : null, isApproved ? new Date() : null, req.params.id]);

    res.json({ message: `Organization status updated to ${status}` });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE organization profile (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM organization_details WHERE id = ?', [req.params.id]);
    res.json({ message: 'Organization profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting org:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
