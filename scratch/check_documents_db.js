const db = require('../Back/db');

async function checkDocuments() {
  try {
    const [rows] = await db.query('SELECT * FROM documents ORDER BY created_at DESC');
    console.log('Total documents in MySQL DB:', rows.length);
    console.log('Documents data:', JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Database query error:', err);
    process.exit(1);
  }
}

checkDocuments();
