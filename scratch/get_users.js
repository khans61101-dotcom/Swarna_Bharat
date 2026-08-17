const db = require('../Back/db');

async function getUsers() {
  try {
    const [rows] = await db.query('SELECT u.id, u.name, u.email, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id');
    console.log('Users in DB:', rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getUsers();
