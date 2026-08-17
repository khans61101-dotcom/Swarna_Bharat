const db = require('../Back/db');

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

async function testQuery() {
  try {
    const [rows] = await db.query(`${BASE_SELECT} WHERE ta.assigned_to = ? ORDER BY ta.assigned_date DESC`, [19]);
    console.log('Query result for user 19 (New6):');
    console.log(rows);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

testQuery();
