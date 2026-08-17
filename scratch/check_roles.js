const db = require('../Back/db');

async function checkRoles() {
  const [roles] = await db.query('SELECT * FROM roles');
  console.log('ROLES TABLE:');
  console.log(roles);
  process.exit(0);
}

checkRoles();
