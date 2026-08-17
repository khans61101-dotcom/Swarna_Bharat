const express = require('express');
const db = require('../db');
const { verifyToken, isAdmin, isAgencyOrNgoOrAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

const VALID_STATUSES = ['Pending', 'Assigned', 'In Progress', 'Submitted', 'Approved', 'Rejected', 'Completed'];

// ─── Helper: base SELECT for assignments ────────────────────────────────────
const BASE_SELECT = `
  SELECT
    ta.id, ta.task_id, ta.assigned_to, ta.assigned_by,
    ta.status, ta.assigned_date, ta.completed_at,
    ta.proof_file, ta.proof_text,
    ta.video_url, ta.submitted_at,
    ta.approved_by, ta.approved_at, ta.earned_points,
    t.title        AS task_title,
    t.description  AS task_description,
    t.points       AS task_points,
    t.priority     AS task_priority,
    t.start_date   AS task_start_date,
    t.due_date     AS task_due_date,
    t.status       AS task_status,
    u_to.name      AS assigned_to_name,
    u_to.email     AS assigned_to_email,
    u_by.name      AS assigned_by_name,
    u_appr.name    AS approved_by_name
  FROM task_assignments ta
  JOIN tasks t        ON ta.task_id     = t.id
  JOIN users u_to     ON ta.assigned_to = u_to.id
  JOIN users u_by     ON ta.assigned_by = u_by.id
  LEFT JOIN users u_appr ON ta.approved_by = u_appr.id
`;

// ─── GET all assignments ─────────────────────────────────────────────────────
// Admin → all | Others → only assignments for themselves (with auto-sync for role tasks)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'Admin' && req.userId) {
      // Auto-assign any active tasks assigned to user's role that are missing for this user
      try {
        await db.query(`
          INSERT INTO task_assignments (task_id, assigned_to, assigned_by, status)
          SELECT DISTINCT t.id, ?, 1, 'Pending'
          FROM tasks t
          JOIN task_assignments ta ON ta.task_id = t.id
          JOIN users u_target ON ta.assigned_to = u_target.id
          JOIN roles r_target ON u_target.role_id = r_target.id
          JOIN users u_me ON u_me.id = ?
          JOIN roles r_me ON u_me.role_id = r_me.id
          WHERE r_target.id = r_me.id
            AND t.status = 'Active'
            AND t.id NOT IN (SELECT task_id FROM task_assignments WHERE assigned_to = ?)
        `, [req.userId, req.userId, req.userId]);
      } catch (syncErr) {
        // Ignore duplicate key or sync errors silently
      }
    }

    let query, params = [];

    if (req.userRole === 'Admin') {
      query = `${BASE_SELECT} ORDER BY ta.assigned_date DESC`;
    } else {
      query = `${BASE_SELECT} WHERE ta.assigned_to = ? ORDER BY ta.assigned_date DESC`;
      params = [req.userId];
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET single assignment by ID ─────────────────────────────────────────────
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `${BASE_SELECT} WHERE ta.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const row = rows[0];

    // Non-admins can only see their own assignments
    if (req.userRole !== 'Admin' && row.assigned_to !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(row);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET assignments for a specific user (Admin only) ────────────────────────
router.get('/user/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `${BASE_SELECT} WHERE ta.assigned_to = ? ORDER BY ta.assigned_date DESC`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET assignments for a specific task (Admin only) ────────────────────────
router.get('/task/:taskId', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `${BASE_SELECT} WHERE ta.task_id = ? ORDER BY ta.assigned_date DESC`,
      [req.params.taskId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching task assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST assign a task (Admin, Agency, NGO) ─────────────────────────────────
router.post('/', verifyToken, isAgencyOrNgoOrAdmin, async (req, res) => {
  const { task_id, target_role } = req.body;

  if (!task_id || !target_role) {
    return res.status(400).json({ error: 'task_id and target_role are required' });
  }

  try {
    // Verify task exists
    const [taskRows] = await db.query('SELECT id, title, points FROM tasks WHERE id = ?', [task_id]);
    if (taskRows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Get all users in the target role
    const [users] = await db.query(`
      SELECT u.id 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE r.name = ?
    `, [target_role]);
    if (users.length === 0) {
      return res.status(404).json({ error: `No users found in role: ${target_role}` });
    }

    // Find existing active assignments for this task to avoid duplicates
    const [existing] = await db.query(`
      SELECT assigned_to FROM task_assignments
      WHERE task_id = ? AND status NOT IN ('Approved', 'Completed', 'Rejected')
    `, [task_id]);
    
    const existingUserIds = new Set(existing.map(e => e.assigned_to));

    // Filter to only users who don't already have the task assigned
    const usersToAssign = users.filter(u => !existingUserIds.has(u.id));

    if (usersToAssign.length === 0) {
      return res.status(400).json({ error: 'All users in this role already have this task actively assigned.' });
    }

    // Bulk insert assignments
    const values = usersToAssign.map(u => [task_id, u.id, req.userId, 'Pending']);
    await db.query(`
      INSERT INTO task_assignments (task_id, assigned_to, assigned_by, status)
      VALUES ?
    `, [values]);

    res.status(201).json({
      message: `Task "${taskRows[0].title}" assigned to ${usersToAssign.length} user(s) in role ${target_role} successfully.`,
      assigned_count: usersToAssign.length
    });
  } catch (error) {
    console.error('Error assigning task to role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH start task by assigned user ────────────────────────────────────────
// Status flow: Pending -> In Progress
router.patch('/:id/start', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM task_assignments WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = rows[0];

    // Only the assigned user (or Admin) can start task
    if (req.userRole !== 'Admin' && assignment.assigned_to !== req.userId) {
      return res.status(403).json({ error: 'Only the assigned user can start this task' });
    }

    if (['In Progress', 'Submitted', 'Approved', 'Completed'].includes(assignment.status)) {
      return res.status(400).json({ error: `Task is already in status '${assignment.status}'` });
    }

    await db.query(`
      UPDATE task_assignments
      SET status = 'In Progress'
      WHERE id = ?
    `, [req.params.id]);

    res.json({ message: 'Task started successfully', status: 'In Progress' });
  } catch (error) {
    console.error('Error starting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH submit proof by assigned user ─────────────────────────────────────
// Status flow: Pending | In Progress | Rejected -> Submitted
router.patch('/:id/submit', verifyToken, async (req, res) => {
  const { proof_text, proof_file, video_url } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM task_assignments WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = rows[0];

    // Only the assigned user (or Admin) can submit proof
    if (req.userRole !== 'Admin' && assignment.assigned_to !== req.userId) {
      return res.status(403).json({ error: 'Only the assigned user can submit proof' });
    }

    // Cannot resubmit if already Approved or Completed
    if (['Approved', 'Completed'].includes(assignment.status)) {
      return res.status(400).json({ error: 'Assignment is already approved/completed. Cannot resubmit.' });
    }

    // Cannot resubmit if Submitted and pending admin review
    if (assignment.status === 'Submitted') {
      return res.status(400).json({ error: 'Proof already submitted. Awaiting admin review.' });
    }

    // Validate: at least proof_text or proof_file must be provided
    if (!proof_text && !proof_file) {
      return res.status(400).json({ error: 'Please provide a description or upload a file as proof.' });
    }

    await db.query(`
      UPDATE task_assignments
      SET
        status       = 'Submitted',
        proof_text   = COALESCE(?, proof_text),
        proof_file   = COALESCE(?, proof_file),
        video_url    = COALESCE(?, video_url),
        submitted_at = NOW(),
        completed_at = NOW()
      WHERE id = ?
    `, [proof_text || null, proof_file || null, video_url || null, req.params.id]);

    res.json({
      message: 'Task proof submitted successfully. Awaiting admin approval.',
      status: 'Submitted'
    });
  } catch (error) {
    console.error('Error submitting proof:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Helper: Record wallet transaction upon Admin approval ─────────────────────
async function recordWalletCredit(userId, taskId, points, taskTitle) {
  if (points <= 0) return;
  const [existing] = await db.query(
    'SELECT id FROM wallet_transactions WHERE user_id = ? AND task_id = ? AND transaction_type = "Credit"',
    [userId, taskId]
  );
  if (existing.length === 0) {
    await db.query(`
      INSERT INTO wallet_transactions (user_id, task_id, points, transaction_type, remarks)
      VALUES (?, ?, ?, 'Credit', ?)
    `, [
      userId,
      taskId,
      points,
      `Task reward credited upon admin approval for: ${taskTitle || 'Task #' + taskId}`
    ]);
  }
}

// ─── PATCH approve assignment (Admin only) ───────────────────────────────────
// Status flow: Submitted -> Approved
router.patch('/:id/approve', verifyToken, isAdmin, async (req, res) => {
  const { earned_points } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT ta.*, t.points as task_points, t.title as task_title FROM task_assignments ta JOIN tasks t ON ta.task_id = t.id WHERE ta.id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = rows[0];
    const points = earned_points != null ? parseInt(earned_points) : assignment.task_points;

    await db.query(`
      UPDATE task_assignments
      SET status = 'Approved', approved_by = ?, approved_at = NOW(), earned_points = ?
      WHERE id = ?
    `, [req.userId, points, req.params.id]);

    // Credit points to user's wallet ONLY AFTER Admin Approval
    await recordWalletCredit(assignment.assigned_to, assignment.task_id, points, assignment.task_title);

    res.json({ message: 'Task assignment approved successfully and points credited to wallet', status: 'Approved', earned_points: points });
  } catch (error) {
    console.error('Error approving assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH reject assignment (Admin only) ────────────────────────────────────
// Status flow: Submitted / In Progress -> Rejected
router.patch('/:id/reject', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM task_assignments WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await db.query(`
      UPDATE task_assignments
      SET status = 'Rejected', approved_by = ?, approved_at = NOW(), earned_points = 0
      WHERE id = ?
    `, [req.userId, req.params.id]);

    res.json({ message: 'Task assignment rejected', status: 'Rejected' });
  } catch (error) {
    console.error('Error rejecting assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH complete assignment ───────────────────────────────────────────────
// Status flow: Approved / Submitted -> Completed
router.patch('/:id/complete', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM task_assignments WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = rows[0];

    // Assigned user or Admin can mark completed
    if (req.userRole !== 'Admin' && assignment.assigned_to !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.query(`
      UPDATE task_assignments
      SET status = 'Completed', completed_at = COALESCE(completed_at, NOW())
      WHERE id = ?
    `, [req.params.id]);

    res.json({ message: 'Task assignment marked as Completed', status: 'Completed' });
  } catch (error) {
    console.error('Error completing assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH approve / reject / complete review (Admin only) ───────────────────
router.patch('/:id/review', verifyToken, isAdmin, async (req, res) => {
  const { action, earned_points } = req.body;  // action: 'approve' | 'reject' | 'complete'

  if (!action || !['approve', 'reject', 'complete'].includes(action)) {
    return res.status(400).json({ error: "action must be 'approve', 'reject', or 'complete'" });
  }

  try {
    const [rows] = await db.query(
      'SELECT ta.*, t.points as task_points, t.title as task_title FROM task_assignments ta JOIN tasks t ON ta.task_id = t.id WHERE ta.id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = rows[0];

    let newStatus = 'Approved';
    let points = assignment.task_points;

    if (action === 'approve') {
      newStatus = 'Approved';
      points = earned_points != null ? parseInt(earned_points) : assignment.task_points;
    } else if (action === 'reject') {
      newStatus = 'Rejected';
      points = 0;
    } else if (action === 'complete') {
      newStatus = 'Completed';
      points = earned_points != null ? parseInt(earned_points) : (assignment.earned_points || assignment.task_points);
    }

    await db.query(`
      UPDATE task_assignments
      SET status = ?, approved_by = ?, approved_at = NOW(), earned_points = ?
      WHERE id = ?
    `, [newStatus, req.userId, points, req.params.id]);

    // Credit points to user's wallet ONLY AFTER Admin Approval / Completion with points
    if (['Approved', 'Completed'].includes(newStatus) && points > 0) {
      await recordWalletCredit(assignment.assigned_to, assignment.task_id, points, assignment.task_title);
    }

    res.json({
      message: `Assignment marked as '${newStatus}'`,
      status: newStatus,
      earned_points: points
    });
  } catch (error) {
    console.error('Error reviewing assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── PATCH update assignment status directly (Admin only) ─────────────────────
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const [existing] = await db.query('SELECT id FROM task_assignments WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await db.query('UPDATE task_assignments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Assignment status updated to '${status}'`, status });
  } catch (error) {
    console.error('Error updating assignment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── DELETE an assignment (Admin only) ───────────────────────────────────────
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM task_assignments WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await db.query('DELETE FROM task_assignments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
