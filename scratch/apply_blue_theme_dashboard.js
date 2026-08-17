const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../Front/src/pages/Dashboard.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace orange color tokens with Royal Blue palette
content = content.replace(/linear-gradient\(135deg,\s*#FF9933,\s*#FF6B00\)/g, 'linear-gradient(135deg, #2563EB, #1D4ED8)');
content = content.replace(/rgba\(255,\s*153,\s*51,\s*0\.3\)/g, 'rgba(37, 99, 235, 0.3)');
content = content.replace(/rgba\(255,153,51,0\.3\)/g, 'rgba(37,99,235,0.3)');
content = content.replace(/rgba\(255,153,51,0\.2\)/g, 'rgba(37,99,235,0.2)');

content = content.replace(/#FF9933/g, '#2563EB');
content = content.replace(/#FF6B00/g, '#1D4ED8');
content = content.replace(/#EA580C/g, '#2563EB');
content = content.replace(/#FFF7ED/g, '#EFF6FF');
content = content.replace(/#FED7AA/g, '#DBEAFE');
content = content.replace(/#FFEDD5/g, '#DBEAFE');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully applied Royal Blue Theme to Front/src/pages/Dashboard.jsx');
