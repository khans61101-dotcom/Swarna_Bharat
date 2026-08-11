const express = require('express');
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// ─── GET logged-in user's wallet balance and transactions ────────────────────
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch transactions
    const [transactions] = await db.query(`
      SELECT wt.*, t.title as task_title
      FROM wallet_transactions wt
      LEFT JOIN tasks t ON wt.task_id = t.id
      WHERE wt.user_id = ?
      ORDER BY wt.created_at DESC
    `, [userId]);

    // Calculate total balance
    let totalCredited = 0;
    let totalDebited = 0;

    for (const tx of transactions) {
      if (tx.transaction_type === 'Credit') {
        totalCredited += Number(tx.points || 0);
      } else if (tx.transaction_type === 'Debit') {
        totalDebited += Number(tx.points || 0);
      }
    }

    const totalBalance = totalCredited - totalDebited;

    res.json({
      user_id: userId,
      balance: totalBalance,
      total_credited: totalCredited,
      total_debited: totalDebited,
      transactions_count: transactions.length,
      transactions: transactions
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET alias /my for wallet balance ────────────────────────────────────────
router.get('/my', verifyToken, async (req, res) => {
  req.url = '/balance';
  return router._handle(req, res);
});

// ─── GET transactions list for logged-in user ────────────────────────────────
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    let query = `
      SELECT wt.*, u.name as user_name, u.email as user_email, t.title as task_title
      FROM wallet_transactions wt
      JOIN users u ON wt.user_id = u.id
      LEFT JOIN tasks t ON wt.task_id = t.id
    `;
    let params = [];

    if (req.userRole !== 'Admin') {
      query += ` WHERE wt.user_id = ?`;
      params.push(req.userId);
    }

    query += ` ORDER BY wt.created_at DESC`;

    const [transactions] = await db.query(query, params);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET specific user's wallet balance (Admin only) ─────────────────────────
router.get('/user/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    const [userRows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [targetUserId]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [transactions] = await db.query(`
      SELECT wt.*, t.title as task_title
      FROM wallet_transactions wt
      LEFT JOIN tasks t ON wt.task_id = t.id
      WHERE wt.user_id = ?
      ORDER BY wt.created_at DESC
    `, [targetUserId]);

    let totalCredited = 0;
    let totalDebited = 0;

    for (const tx of transactions) {
      if (tx.transaction_type === 'Credit') {
        totalCredited += Number(tx.points || 0);
      } else if (tx.transaction_type === 'Debit') {
        totalDebited += Number(tx.points || 0);
      }
    }

    res.json({
      user: userRows[0],
      balance: totalCredited - totalDebited,
      total_credited: totalCredited,
      total_debited: totalDebited,
      transactions: transactions
    });
  } catch (error) {
    console.error('Error fetching user wallet balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
