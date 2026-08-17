const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '../Back/public/js/app.js');
let content = fs.readFileSync(target, 'utf8');

// Replace loadUsers renderAccountsTree call with safe try-catch
content = content.replace(/renderAccountsTree\(data\);/g, `try { renderAccountsTree(data); } catch(treeErr) { console.error('Tree render error:', treeErr); }`);

fs.writeFileSync(target, content, 'utf8');
console.log('Safely wrapped renderAccountsTree inside try-catch in loadUsers!');
