const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// GET users list with downline count
router.get('/', verifyToken, async (req, res) => {
  try {
    let query;
    let params = [];
    
    if (req.userRole === 'Admin') {
      // Admin views everyone with creator name & downline count
      query = `
        SELECT u.id, u.name, u.email, u.phone, u.dob, u.address, u.city, u.state, u.pincode,
               u.bank_name, u.account_no, u.ifsc_code, u.upi_id, u.referral_code, u.referral_link,
               u.referred_by, u.created_at,
               r.name as role_name, creator.name as created_by_name,
               (SELECT COUNT(*) FROM users d WHERE d.created_by = u.id) as downline_count
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN users creator ON u.created_by = creator.id
        ORDER BY u.created_at DESC
      `;
    } else if (req.userRole === 'Agency' || req.userRole === 'NGO' || req.userRole === 'Agent') {
      // Agency / NGO view only their own created Members and Users
      query = `
        SELECT u.id, u.name, u.email, u.phone, u.dob, u.address, u.city, u.state, u.pincode,
               u.bank_name, u.account_no, u.ifsc_code, u.upi_id, u.referral_code, u.referral_link,
               u.referred_by, u.created_at,
               r.name as role_name, creator.name as created_by_name,
               (SELECT COUNT(*) FROM users d WHERE d.created_by = u.id) as downline_count
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN users creator ON u.created_by = creator.id
        WHERE u.created_by = ?
        ORDER BY u.created_at DESC
      `;
      params = [req.userId];
    } else {
      // Users / Members view accounts created directly under them
      query = `
        SELECT u.id, u.name, u.email, u.phone, u.dob, u.address, u.city, u.state, u.pincode,
               u.bank_name, u.account_no, u.ifsc_code, u.upi_id, u.referral_code, u.referral_link,
               u.referred_by, u.created_at,
               r.name as role_name, creator.name as created_by_name,
               (SELECT COUNT(*) FROM users d WHERE d.created_by = u.id) as downline_count
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN users creator ON u.created_by = creator.id
        WHERE u.created_by = ?
        ORDER BY u.created_at DESC
      `;
      params = [req.userId];
    }

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET downline members for a specific user ID
router.get('/:id/downline', verifyToken, async (req, res) => {
  const parentId = req.params.id;
  try {
    const query = `
      SELECT u.id, u.name, u.email, u.phone, u.dob, u.address, u.city, u.state, u.pincode,
             u.bank_name, u.account_no, u.ifsc_code, u.upi_id, u.referral_code, u.referral_link,
             u.referred_by, u.created_at,
             r.name as role_name,
             (SELECT COUNT(*) FROM users d WHERE d.created_by = u.id) as downline_count
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.created_by = ?
      ORDER BY u.created_at DESC
    `;
    const [rows] = await db.query(query, [parentId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching downline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST to create a new user or member by Admin, Agency, or NGO
router.post('/', verifyToken, async (req, res) => {
  const {
    name, email, password, phone, dob, address, city, state, pincode,
    bank_name, account_no, ifsc_code, upi_id, target_role, profile_image
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, Email, and Password are required' });
  }

  try {
    // Check if email exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Determine target role based on creator's role
    let newRoleName = 'User';
    const allowedForAdmin = ['Agency', 'NGO', 'Member', 'User', 'Agent'];
    const allowedForOrg = ['User', 'Member'];

    if (req.userRole === 'Admin') {
      newRoleName = (target_role && allowedForAdmin.includes(target_role)) ? target_role : 'Agency';
    } else if (req.userRole === 'Agency' || req.userRole === 'NGO' || req.userRole === 'Agent') {
      newRoleName = (target_role && allowedForOrg.includes(target_role)) ? target_role : 'User';
    } else if (req.userRole === 'User' || req.userRole === 'Member') {
      newRoleName = 'Member';
    } else {
      return res.status(403).json({ error: 'Not authorized to create accounts' });
    }

    const [roleRows] = await db.query('SELECT id FROM roles WHERE name = ?', [newRoleName]);
    if (roleRows.length === 0) {
      return res.status(500).json({ error: `Role '${newRoleName}' not found in database` });
    }
    const roleId = roleRows[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-generate referral code and link for newly created user
    const cleanName = (name || 'USER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4);
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newRefCode = `REF-${cleanName}-${randomHex}`;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const newRefLink = `${baseUrl}/register.html?ref=${newRefCode}`;

    const [result] = await db.query(`
      INSERT INTO users (
        role_id, created_by, name, email, password, phone, dob, address,
        city, state, pincode, bank_name, account_no, ifsc_code, upi_id,
        referral_code, referral_link, referred_by, profile_image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      roleId, req.userId, name, email, hashedPassword,
      phone || null, dob || null, address || null, city || null, state || null, pincode || null,
      bank_name || null, account_no || null, ifsc_code || null, upi_id || null,
      newRefCode, newRefLink, req.userId, profile_image || null
    ]);

    res.status(201).json({ message: `${newRoleName} created successfully!`, id: result.insertId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
