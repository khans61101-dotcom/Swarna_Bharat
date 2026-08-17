const db = require('../Back/db');

async function cleanDemoDocs() {
  try {
    console.log("Cleaning demo documents from database...");
    await db.query(`
      DELETE FROM documents WHERE title LIKE '%National Swarna Bharat Movement Registration Guidelines%' 
      OR title LIKE '%NGO & Agency Partnership Application Form%' 
      OR title LIKE '%Official Gazette Notification on Youth Skill Initiatives%';
    `);
    
    const [rows] = await db.query('SELECT * FROM documents ORDER BY created_at DESC');
    console.log('Current DB Documents count:', rows.length);
    console.log('Current DB Documents:', JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning demo documents:', err);
    process.exit(1);
  }
}

cleanDemoDocs();
