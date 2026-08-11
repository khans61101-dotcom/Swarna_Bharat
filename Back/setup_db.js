const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  try {
    // Connect without database to create it first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    const dbName = process.env.DB_NAME || 'nemotype_db';
    console.log(`Ensuring database '${dbName}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    console.log('Creating roles table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )
    `);

    console.log('Inserting default roles...');
    await connection.query(`INSERT IGNORE INTO roles (name) VALUES ('Admin'), ('Agency'), ('NGO'), ('Member'), ('User')`);

    // Migrate existing Agent users to Agency and remove Agent role
    try {
      const [agentRole] = await connection.query(`SELECT id FROM roles WHERE name = 'Agent'`);
      if (agentRole.length > 0) {
        const [agencyRole] = await connection.query(`SELECT id FROM roles WHERE name = 'Agency'`);
        if (agencyRole.length > 0) {
          await connection.query(`UPDATE users SET role_id = ? WHERE role_id = ?`, [agencyRole[0].id, agentRole[0].id]);
        }
        await connection.query(`DELETE FROM roles WHERE name = 'Agent'`);
        console.log('Migrated Agent role users to Agency role.');
      }
    } catch (e) {
      console.log('Role cleanup note:', e.message);
    }

    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        created_by INT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NULL,
        dob VARCHAR(20) NULL,
        address TEXT NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        pincode VARCHAR(20) NULL,
        bank_name VARCHAR(100) NULL,
        account_no VARCHAR(50) NULL,
        ifsc_code VARCHAR(20) NULL,
        upi_id VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Ensure columns exist if table was already created
    const alterColumns = [
      "phone VARCHAR(20) NULL",
      "dob VARCHAR(20) NULL",
      "address TEXT NULL",
      "city VARCHAR(100) NULL",
      "state VARCHAR(100) NULL",
      "pincode VARCHAR(20) NULL",
      "bank_name VARCHAR(100) NULL",
      "account_no VARCHAR(50) NULL",
      "ifsc_code VARCHAR(20) NULL",
      "upi_id VARCHAR(100) NULL",
      "referral_code VARCHAR(100) NULL UNIQUE",
      "referral_link VARCHAR(255) NULL",
      "referred_by INT NULL",
      "profile_image VARCHAR(255) NULL",
      "cover_image VARCHAR(255) NULL"
    ];

    for (const col of alterColumns) {
      try {
        await connection.query(`ALTER TABLE users ADD COLUMN ${col}`);
      } catch (err) {
        // Column probably already exists, ignore error
      }
    }

    // Backfill referral codes for existing users who lack one
    try {
      const [usersWithoutRef] = await connection.query(`SELECT id, name FROM users WHERE referral_code IS NULL OR referral_code = ''`);
      for (const u of usersWithoutRef) {
        const cleanName = (u.name || 'USER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4);
        const code = `REF-${cleanName}-${u.id}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const link = `${baseUrl}/register.html?ref=${code}`;
        await connection.query(`UPDATE users SET referral_code = ?, referral_link = ? WHERE id = ?`, [code, link, u.id]);
      }
    } catch (e) {
      console.log('Referral backfill note:', e.message);
    }

    console.log('Creating organization_details table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS organization_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        organization_name VARCHAR(255) NULL,
        organization_type VARCHAR(50) NULL,
        registration_number VARCHAR(100) NULL,
        gst_number VARCHAR(100) NULL,
        pan_number VARCHAR(100) NULL,
        website VARCHAR(255) NULL,
        logo VARCHAR(255) NULL,
        registration_document VARCHAR(255) NULL,
        pan_document VARCHAR(255) NULL,
        address TEXT NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        country VARCHAR(100) NULL,
        pincode VARCHAR(20) NULL,
        description TEXT NULL,
        approved_by INT NULL,
        approved_at TIMESTAMP NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log('Creating email_otps table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS email_otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    console.log('Creating tasks table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        points INT DEFAULT 0,
        priority ENUM('Low','Medium','High','Urgent') DEFAULT 'Medium',
        start_date DATE NULL,
        due_date DATE NULL,
        status ENUM('Active','Inactive') DEFAULT 'Active',
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Migrate status ENUM if table already exists with old values
    try {
      await connection.query(`
        ALTER TABLE tasks
        MODIFY COLUMN status ENUM('Active','Inactive','Pending','In Progress','Completed','Cancelled') DEFAULT 'Active'
      `);
      // Set old statuses to Active
      await connection.query(`UPDATE tasks SET status = 'Active' WHERE status IN ('Pending','In Progress','Completed','Cancelled')`);
      // Now shrink to new ENUM
      await connection.query(`
        ALTER TABLE tasks
        MODIFY COLUMN status ENUM('Active','Inactive') DEFAULT 'Active'
      `);
    } catch (err) {
      // Ignore if already correct
    }

    console.log('Creating task_assignments table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS task_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        assigned_to INT NOT NULL,
        assigned_by INT NOT NULL,
        status ENUM('Pending','Assigned','In Progress','Submitted','Approved','Rejected','Completed') DEFAULT 'Pending',
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        proof_file VARCHAR(255) NULL,
        proof_text TEXT NULL,
        approved_by INT NULL,
        approved_at TIMESTAMP NULL,
        earned_points INT DEFAULT 0,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Modify column in case table was created with old ENUM
    try {
      await connection.query(`
        ALTER TABLE task_assignments
        MODIFY COLUMN status ENUM('Pending','Assigned','In Progress','Submitted','Approved','Rejected','Completed') DEFAULT 'Pending'
      `);
    } catch (err) {
      // Ignore if alter fails
    }

    console.log('Creating wallet_transactions table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        task_id INT NULL,
        points INT NOT NULL,
        transaction_type ENUM('Credit','Debit') NOT NULL DEFAULT 'Credit',
        remarks VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
      )
    `);

    console.log('Creating news table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NULL,
        date VARCHAR(50) NULL,
        category VARCHAR(100) NULL,
        category_hi VARCHAR(100) NULL,
        snippet TEXT NULL,
        snippet_hi TEXT NULL,
        image VARCHAR(255) NULL,
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Ensure created_by column exists
    try {
      await connection.query('ALTER TABLE news ADD COLUMN created_by INT NULL');
    } catch (err) {
      // Column already exists
    }

    console.log('Creating events table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        day VARCHAR(20) NULL,
        month VARCHAR(20) NULL,
        year VARCHAR(20) NULL,
        title VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NULL,
        location VARCHAR(255) NULL,
        location_hi VARCHAR(255) NULL,
        category VARCHAR(100) NULL,
        category_hi VARCHAR(100) NULL,
        image VARCHAR(255) NULL,
        \`desc\` TEXT NULL,
        desc_hi TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating hero_settings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hero_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_url VARCHAR(500) NULL,
        title VARCHAR(255) NULL,
        title_hi VARCHAR(255) NULL,
        subtitle TEXT NULL,
        subtitle_hi TEXT NULL,
        badge_text VARCHAR(100) NULL,
        badge_text_hi VARCHAR(100) NULL,
        btn1_text VARCHAR(100) NULL,
        btn1_link VARCHAR(255) NULL,
        btn2_text VARCHAR(100) NULL,
        btn2_link VARCHAR(255) NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating gallery table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        src VARCHAR(255) NOT NULL,
        title VARCHAR(255) NULL,
        title_hi VARCHAR(255) NULL,
        category VARCHAR(100) NULL,
        category_hi VARCHAR(100) NULL,
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Ensure created_by column exists
    try {
      await connection.query('ALTER TABLE gallery ADD COLUMN created_by INT NULL');
    } catch (err) {
      // Column already exists
    }

    console.log('Creating enquiries table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NULL,
        phone VARCHAR(20) NULL,
        subject VARCHAR(255) NULL,
        message TEXT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating blogs table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NULL,
        author VARCHAR(100) NULL,
        content TEXT NULL,
        content_hi TEXT NULL,
        image VARCHAR(255) NULL,
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Ensure created_by column exists
    try {
      await connection.query('ALTER TABLE blogs ADD COLUMN created_by INT NULL');
    } catch (err) {
      // Column already exists
    }

    // Create a default admin user if none exists
    const [adminRows] = await connection.query(`SELECT id FROM users WHERE email = ?`, ['admin@nemotype.com']);
    
    if (adminRows.length === 0) {
      console.log('Creating default Admin user (admin@nemotype.com / password123)...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      const [roleRows] = await connection.query(`SELECT id FROM roles WHERE name = 'Admin'`);
      const adminRoleId = roleRows[0].id;
      
      await connection.query(`
        INSERT INTO users (role_id, created_by, name, email, password)
        VALUES (?, NULL, 'Super Admin', 'admin@nemotype.com', ?)
      `, [adminRoleId, hashedPassword]);
      console.log('Default Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Database setup completed successfully!');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
