const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../Back/public/js/app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

const marker = "updateEnquiryStatus(${e.id}";
const idx = content.indexOf(marker);

if (idx !== -1) {
  console.log("Found at index:", idx);
  console.log("Snippet:");
  console.log(JSON.stringify(content.substring(idx - 50, idx + 200)));
  
  // Replace direct slice around idx
  const beforeMarker = content.lastIndexOf('<td>', idx);
  const afterMarker = content.indexOf('</td>', idx) + 5;
  
  console.log("Before slice:", JSON.stringify(content.substring(beforeMarker, afterMarker)));
  
  const replacement = `<td style="display:flex;gap:6px;align-items:center;">
                    <button onclick="updateEnquiryStatus(\${e.id}, '\${e.status === 'Pending' ? 'Resolved' : 'Pending'}')" style="background:#0F172A;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        \${e.status === 'Pending' ? '✅ Resolve' : '🔄 Reopen'}
                    </button>
                    <button onclick="deleteItem('/enquiries/\${e.id}', loadEnquiries)" style="background:#DC2626;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        🗑️ Delete
                    </button>
                </td>`;

  const updated = content.substring(0, beforeMarker) + replacement + content.substring(afterMarker);
  fs.writeFileSync(appJsPath, updated, 'utf8');
  console.log("SUCCESSFULLY INJECTED DELETE BUTTON INTO APP.JS!");
} else {
  console.error("Marker not found");
}
