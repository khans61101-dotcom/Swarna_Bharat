const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../Back/public/js/app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

const oldChunk = `<td>
                    <button onclick="updateEnquiryStatus(\${e.id}, '\${e.status === 'Pending' ? 'Resolved' : 'Pending'}')" style="background:#0F172A;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        \${e.status === 'Pending' ? '✅ Resolve' : '🔄 Reopen'}
                    </button>
                </td>`;

const newChunk = `<td style="display:flex;gap:6px;align-items:center;">
                    <button onclick="updateEnquiryStatus(\${e.id}, '\${e.status === 'Pending' ? 'Resolved' : 'Pending'}')" style="background:#0F172A;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        \${e.status === 'Pending' ? '✅ Resolve' : '🔄 Reopen'}
                    </button>
                    <button onclick="deleteItem('/enquiries/\${e.id}', loadEnquiries)" style="background:#DC2626;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        🗑️ Delete
                    </button>
                </td>`;

if (content.includes(oldChunk)) {
  content = content.replace(oldChunk, newChunk);
  fs.writeFileSync(appJsPath, content, 'utf8');
  console.log("SUCCESSFULLY INJECTED DELETE BUTTON INTO loadEnquiries!");
} else {
  console.error("String match failed");
}
