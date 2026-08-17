const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../Back/public/js/app.js');
const content = fs.readFileSync(appJsPath, 'utf8');

console.log('Contains window.deleteItem:', content.includes('window.deleteItem'));
console.log('Contains window.deleteEnquiry:', content.includes('window.deleteEnquiry'));
console.log('Contains window.loadEnquiries:', content.includes('window.loadEnquiries'));
console.log('Contains window.updateEnquiryStatus:', content.includes('window.updateEnquiryStatus'));
