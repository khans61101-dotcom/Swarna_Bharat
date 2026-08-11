const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool. We don't specify DB_NAME here initially so we can use it to create the DB if it doesn't exist
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nemotype_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
