const db = require('../Back/db');

async function getAdminPass() {
  const [rows] = await db.query('SELECT id, name, email, password FROM users WHERE id=1');
  console.log('Admin user:', rows[0]);
  process.exit(0);
}

getAdminPass();
