const db = require('../Back/db');

async function updateEventsSchema() {
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM events LIKE 'gallery_images'");
    if (cols.length === 0) {
      console.log("Adding 'gallery_images' column to 'events' table...");
      await db.query("ALTER TABLE events ADD COLUMN gallery_images TEXT NULL");
      console.log("Column 'gallery_images' added successfully!");
    } else {
      console.log("Column 'gallery_images' already exists in 'events' table.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error updating events table schema:", err);
    process.exit(1);
  }
}

updateEventsSchema();
