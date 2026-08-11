const db = require('./db');
db.query("ALTER TABLE gallery ADD COLUMN type VARCHAR(20) DEFAULT 'image'")
  .then(() => { console.log('Column added'); process.exit(0); })
  .catch(e => { console.log(e.message); process.exit(1); });
