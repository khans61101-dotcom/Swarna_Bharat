process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Sajid@123';
process.env.DB_NAME = 'nemotype_db';

const db = require('../Back/db');

async function test() {
  try {
    const [users] = await db.query('SELECT id, name, email, role_id, created_by, referred_by, referral_code FROM users');
    console.log('--- ALL USERS IN DB ---');

    for (let u of users.slice(0, 5)) {
      const partnerId = u.id;
      const partnerRefCode = u.referral_code || '';

      const [downlines] = await db.query(`
        WITH RECURSIVE Downlines AS (
          SELECT id, name, email, phone, address, city, state, role_id, created_by, referred_by, referral_code, profile_image, created_at 
          FROM users 
          WHERE created_by = ? 
             OR referred_by = ?
          UNION ALL
          SELECT u.id, u.name, u.email, u.phone, u.address, u.city, u.state, u.role_id, u.created_by, u.referred_by, u.referral_code, u.profile_image, u.created_at
          FROM users u
          INNER JOIN Downlines d ON (
            u.created_by = d.id 
            OR u.referred_by = d.id
          )
        )
        SELECT d.*, r.name as role_name 
        FROM Downlines d
        JOIN roles r ON d.role_id = r.id
        ORDER BY d.created_at DESC
      `, [partnerId, partnerId]);

      console.log(`\n--- DOWNLINES FOR USER ID ${u.id} (${u.name}) --- [Count: ${downlines.length}]`);
      console.table(downlines.map(x => ({ id: x.id, name: x.name, email: x.email, role_name: x.role_name, created_by: x.created_by, referred_by: x.referred_by })));
    }
  } catch(e) {
    console.error('ERROR:', e);
  }
  process.exit();
}

test();
