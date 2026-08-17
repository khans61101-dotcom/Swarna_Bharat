const db = require('../Back/db');

async function debug() {
  try {
    const [u] = await db.query('SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.name LIKE "%New6%" OR u.email LIKE "%new6%"');
    console.log('--- USER NEW6 ---');
    console.log(u);

    const [t] = await db.query('SELECT * FROM tasks');
    console.log('--- TASKS ---');
    console.log(t);

    const [ta] = await db.query('SELECT * FROM task_assignments WHERE assigned_to = ?', [u[0]?.id || 0]);
    console.log('--- ASSIGNMENTS FOR NEW6 ---');
    console.log(ta);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

debug();
