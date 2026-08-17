const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '../Back/public/dashboard.html');
const content = fs.readFileSync(dashPath, 'utf8');

console.log('Total file length:', content.length, 'characters');
console.log('Contains <aside class="sidebar">:', content.includes('<aside class="sidebar">'));
console.log('Contains <header class="header">:', content.includes('<header class="header">'));
console.log('Contains Performance Line Chart:', content.includes('Performance Line Chart'));
console.log('Contains Status Summary:', content.includes('Status Summary'));
console.log('Contains <script src="js/app.js">:', content.includes('<script src="js/app.js">'));
