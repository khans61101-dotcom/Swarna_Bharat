const express = require('express');
const db = require('../db');
const { verifyToken, isAdmin, isAgencyOrNgoOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const VALID_STATUSES   = ['Active', 'Inactive'];

// ─── GET all tasks ───────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, u.name AS created_by_name,
             (SELECT GROUP_CONCAT(DISTINCT COALESCE(ta.target_role, r.name) SEPARATOR ', ')
              FROM task_assignments ta
              LEFT JOIN users u_to ON ta.assigned_to = u_to.id
              LEFT JOIN roles r ON u_to.role_id = r.id
              WHERE ta.task_id = t.id) AS assigned_roles
      FROM tasks t
      LEFT JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET single task by ID ──────────────────────────────────────────────────
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, u.name AS created_by_name
      FROM tasks t
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST create a new task (Admin, Agency, NGO) ───────────────────────────
router.post('/', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  const { title, description, points, priority, start_date, due_date, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (points == null || points === '') {
    return res.status(400).json({ error: 'Points are required' });
  }
  if (!start_date) {
    return res.status(400).json({ error: 'Start date is required' });
  }
  if (!due_date) {
    return res.status(400).json({ error: 'Due date is required' });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO tasks (title, description, points, priority, start_date, due_date, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title.trim(),
      description || null,
      parseInt(points),
      priority || 'Medium',
      start_date,
      due_date,
      status || 'Active',
      req.userId
    ]);

    const [newTask] = await db.query(`
      SELECT t.*, u.name AS created_by_name
      FROM tasks t LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `, [result.insertId]);

    res.status(201).json({ message: 'Task created successfully', task: newTask[0] });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PUT update a task (Admin only) ──────────────────────────────────────────
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { title, description, points, priority, start_date, due_date, status } = req.body;

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const [existing] = await db.query('SELECT id FROM tasks WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.query(`
      UPDATE tasks SET
        title       = COALESCE(?, title),
        description = COALESCE(?, description),
        points      = COALESCE(?, points),
        priority    = COALESCE(?, priority),
        start_date  = COALESCE(?, start_date),
        due_date    = COALESCE(?, due_date),
        status      = COALESCE(?, status),
        updated_at  = NOW()
      WHERE id = ?
    `, [
      title ? title.trim() : null,
      description !== undefined ? description : null,
      points != null ? parseInt(points) : null,
      priority || null,
      start_date || null,
      due_date || null,
      status || null,
      req.params.id
    ]);

    const [updatedTask] = await db.query(`
      SELECT t.*, u.name AS created_by_name
      FROM tasks t LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `, [req.params.id]);

    res.json({ message: 'Task updated successfully', task: updatedTask[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── DELETE a task (Admin only) ───────────────────────────────────────────────
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id, title FROM tasks WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: `Task "${existing[0].title}" deleted successfully` });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
