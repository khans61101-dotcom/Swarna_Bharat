const db = require('../Back/db');

async function testNetwork() {
  try {
    const [users] = await db.query('SELECT u.id, u.name, u.created_by, u.referred_by FROM users u');
    console.log('All Users:', users);

    // Pick user 2 (sajid) or user 1
    for (const u of users) {
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
        SELECT d.id, d.name, d.created_by, d.referred_by, r.name as role_name 
        FROM Downlines d
        JOIN roles r ON d.role_id = r.id
      `, [u.id, u.id]);

      console.log(`User ${u.id} (${u.name}) has ${downlines.length} downline members:`, downlines.map(d => d.name));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testNetwork();
