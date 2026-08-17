const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../Front/src/pages/ProfileDetails.jsx'),
  path.join(__dirname, '../Front/src/pages/css/ProfilePage.css')
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/linear-gradient\(135deg,\s*#FF9933,\s*#FF6B00\)/g, 'linear-gradient(135deg, #2563EB, #1D4ED8)');
    content = content.replace(/linear-gradient\(135deg,\s*#ff9933,\s*#ff6b00\)/g, 'linear-gradient(135deg, #2563EB, #1D4ED8)');
    content = content.replace(/rgba\(255,\s*153,\s*51,\s*0\.3\)/g, 'rgba(37, 99, 235, 0.3)');
    content = content.replace(/rgba\(255,153,51,0\.3\)/g, 'rgba(37,99,235,0.3)');
    content = content.replace(/#FF9933/gi, '#2563EB');
    content = content.replace(/#FF6B00/gi, '#1D4ED8');
    content = content.replace(/#EA580C/gi, '#2563EB');
    content = content.replace(/#FFF7ED/gi, '#EFF6FF');
    content = content.replace(/#FED7AA/gi, '#DBEAFE');
    content = content.replace(/#FFEDD5/gi, '#DBEAFE');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated theme in:', file);
  }
});
