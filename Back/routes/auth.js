const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

async function sendOtpMail(toEmail, otpCode) {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || `Swarna Bharat Portal <${user || 'no-reply@swarnabharat.org'}>`;

  if (!user || !pass) {
    console.log(`\n==================================================`);
    console.log(`[DEV OTP LOG] Email: ${toEmail} | OTP Code: ${otpCode}`);
    console.log(`(Configure EMAIL_USER & EMAIL_PASS in Back/.env for SMTP delivery)`);
    console.log(`==================================================\n`);
    return { sent: false, reason: 'SMTP credentials missing in .env. OTP printed to server console.' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from,
    to: toEmail,
    subject: 'Your Registration OTP - Swarna Bharat Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #FF9933; margin: 0;">Swarna Bharat Portal</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Government Citizen Access Portal</p>
        </div>
        <div style="background-color: #fff7ed; padding: 20px; border-radius: 10px; border-left: 4px solid #FF9933; margin-bottom: 20px;">
          <p style="font-size: 16px; color: #1e293b; margin: 0 0 10px 0;">Hello,</p>
          <p style="font-size: 14px; color: #475569; margin: 0 0 15px 0;">Your One Time Password (OTP) for account registration is:</p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #FF9933; text-align: center; padding: 15px; background: #ffffff; border-radius: 8px; border: 2px dashed #fed7aa; margin: 15px 0;">
            ${otpCode}
          </div>
          <p style="font-size: 12px; color: #64748b; margin: 10px 0 0 0; text-align: center;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">If you did not request this OTP, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  return { sent: true };
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query(`
      SELECT users.*, roles.name as role_name 
      FROM users 
      JOIN roles ON users.role_id = roles.id 
      WHERE email = ?
    `, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid Password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role_name }, 
      process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production', 
      { expiresIn: 86400 } // 24 hours
    );

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role_name,
      referral_code: user.referral_code,
      referral_link: user.referral_link,
      referred_by: user.referred_by,
      accessToken: token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Database Error: ' + (error.message || 'Internal server error') });
  }
});

// Helper function to generate unique referral code
async function generateUniqueReferralCode(name) {
  const cleanName = (name || 'USER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4);
  let isUnique = false;
  let code = '';
  let attempts = 0;
  while (!isUnique && attempts < 10) {
    attempts++;
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    code = `REF-${cleanName}-${randomHex}`;
    const [existing] = await db.query('SELECT id FROM users WHERE referral_code = ?', [code]);
    if (existing.length === 0) {
      isUnique = true;
    }
  }
  return code;
}

// ── POST /api/auth/send-otp ──────────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    // Check if email already registered
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered. Please login instead.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Clean previous OTPs for this email
    await db.query('DELETE FROM email_otps WHERE email = ?', [email]);

    // Insert new OTP into email_otps table
    await db.query(
      'INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    // Send email
    let mailResult = { sent: false };
    try {
      mailResult = await sendOtpMail(email, otp);
    } catch (err) {
      console.error('Error sending OTP mail:', err);
    }

    res.status(200).json({
      message: 'OTP sent to your email address successfully.',
      email,
      otpLogged: !mailResult.sent ? otp : undefined
    });
  } catch (error) {
    console.error('Error in /send-otp:', error);
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// ── POST /api/auth/verify-otp ────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM email_otps WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email, otp.trim()]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new OTP.' });
    }

    res.status(200).json({ message: 'OTP verified successfully.', verified: true });
  } catch (error) {
    console.error('Error in /verify-otp:', error);
    res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

// ── POST /api/auth/forgot-password/send-otp ────────────────────────────────
router.post('/forgot-password/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    const [existing] = await db.query('SELECT id, name FROM users WHERE email = ?', [email.trim()]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'No user account found with this email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.query('DELETE FROM email_otps WHERE email = ?', [email.trim()]);

    await db.query(
      'INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)',
      [email.trim(), otp, expiresAt]
    );

    let mailResult = { sent: false };
    try {
      mailResult = await sendOtpMail(email.trim(), otp);
    } catch (err) {
      console.error('Error sending reset OTP mail:', err);
    }

    res.status(200).json({
      message: 'Password reset OTP sent to your email address successfully.',
      email: email.trim(),
      otpLogged: !mailResult.sent ? otp : undefined
    });
  } catch (error) {
    console.error('Error in /forgot-password/send-otp:', error);
    res.status(500).json({ error: 'Failed to send password reset OTP.' });
  }
});

// ── POST /api/auth/forgot-password/reset ────────────────────────────────────
router.post('/forgot-password/reset', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const [otpRows] = await db.query(
      'SELECT id FROM email_otps WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email.trim(), otp.trim()]
    );

    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP code. Please try again.' });
    }

    const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email.trim()]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email.trim()]);

    await db.query('DELETE FROM email_otps WHERE email = ?', [email.trim()]);

    res.status(200).json({
      message: 'Password reset successfully! You can now login with your new password.',
      success: true
    });
  } catch (error) {
    console.error('Error in /forgot-password/reset:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    referral_code,
    ref,
    profile_image,
    role,
    otp
  } = req.body;

  if (!name || !email || !password || !otp) {
    return res.status(400).json({ error: 'Name, email, password, and OTP are required.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Verify OTP
    const [otpRows] = await db.query(
      'SELECT id FROM email_otps WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email, otp.trim()]
    );

    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please verify your OTP code.' });
    }

    // Lookup referred_by user ID if referral code is provided
    let referredById = null;
    const refCodeInput = referral_code || ref;
    if (refCodeInput) {
      const [referrerRows] = await db.query('SELECT id FROM users WHERE referral_code = ?', [refCodeInput.trim()]);
      if (referrerRows.length > 0) {
        referredById = referrerRows[0].id;
      }
    }

   const selectedRole = role || "User";

console.log("selectedRole =", selectedRole);         
const [roleRows] = await db.query(
  "SELECT id FROM roles WHERE name = ?",
  [selectedRole]
);

if (roleRows.length === 0) {
  return res.status(400).json({
    error: `Invalid role selected: ${selectedRole}`
  });
}

const roleId = roleRows[0].id;    

    const hashedPassword = await bcrypt.hash(password, 10);
    const newRefCode = await generateUniqueReferralCode(name);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const newRefLink = `${baseUrl}/register.html?ref=${newRefCode}`;

    const [result] = await db.query(`
      INSERT INTO users (role_id, created_by, name, email, password, phone, referral_code, referral_link, referred_by, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [roleId, referredById, name, email, hashedPassword, phone || null, newRefCode, newRefLink, referredById, profile_image || null]);

    // Credit referral reward points to referrer's wallet
    if (referredById) {
      try {
        const [ptsRows] = await db.query(
          'SELECT points FROM referral_role_points WHERE role_id = ?',
          [roleId]
        );
        const pts = (ptsRows.length > 0) ? ptsRows[0].points : 50;
        if (pts > 0) {
          await db.query(`
            INSERT INTO wallet_transactions (user_id, points, transaction_type, remarks)
            VALUES (?, ?, 'Credit', ?)
          `, [
            referredById,
            pts,
            `Referral reward points for inviting ${name} (${selectedRole})`
          ]);
        }
      } catch (refErr) {
        console.error('Error crediting referral points:', refErr);
      }
    }

    res.status(201).json({
      message: 'User registered successfully!',
      id: result.insertId,
      referral_code: newRefCode,
      referral_link: newRefLink,
      referred_by: referredById
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET current logged-in user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.dob, u.address, u.city, u.state, u.pincode,
             u.bank_name, u.account_no, u.ifsc_code, u.upi_id, u.referral_code, u.referral_link,
             u.referred_by, u.profile_image, u.cover_image, u.created_at, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [req.userId]);

    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update logged-in user profile
router.put('/profile', verifyToken, async (req, res) => {
  const { name, phone, dob, address, city, state, pincode, bank_name, account_no, ifsc_code, upi_id, profile_image, cover_image } = req.body;
  try {
    await db.query(`
      UPDATE users SET
        name = ?, phone = ?, dob = ?, address = ?, city = ?, state = ?, pincode = ?,
        bank_name = ?, account_no = ?, ifsc_code = ?, upi_id = ?,
        profile_image = COALESCE(?, profile_image),
        cover_image = COALESCE(?, cover_image)
      WHERE id = ?
    `, [name, phone, dob, address, city, state, pincode, bank_name, account_no, ifsc_code, upi_id, profile_image, cover_image, req.userId]);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT change password
router.put('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required' });
  }

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNew, req.userId]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
