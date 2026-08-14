const db = require('../Back/db');

async function createDocumentsTable() {
  try {
    console.log("Creating 'documents' table if not exists...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NULL,
        category VARCHAR(100) DEFAULT 'General',
        file_url VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) DEFAULT 'pdf',
        file_size VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("'documents' table created/verified successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating documents table:", err);
    process.exit(1);
  }
}

createDocumentsTable();
