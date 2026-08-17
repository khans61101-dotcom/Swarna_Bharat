const jwt = require('jsonwebtoken');
const db = require('../Back/db');

async function testApi() {
  try {
    // Generate token for admin (user id 1)
    const [users] = await db.query('SELECT * FROM users WHERE id = 1');
    const admin = users[0];
    const token = jwt.sign({ userId: admin.id, role: 'Admin' }, process.env.JWT_SECRET || 'secretKey_swarn_india_2026');

    console.log('Testing GET /api/users with Admin token...');
    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    const res = await fetch('http://localhost:3000/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Users count:', data.length);
    if (data.length > 0) {
      console.log('Sample user:', data[0]);
    }
    process.exit(0);
  } catch (e) {
    console.error('API Test Error:', e);
    process.exit(1);
  }
}

testApi();
