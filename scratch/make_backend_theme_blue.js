const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../Back/public');

// Function to replace Orange with Royal Blue in a file string
function replaceOrangeWithBlue(str) {
  return str
    .replace(/#FF9933/gi, '#2563eb')
    .replace(/#FF6B00/gi, '#1d4ed8')
    .replace(/#e67e00/gi, '#1e40af')
    .replace(/#ff8800/gi, '#3b82f6')
    .replace(/rgba\(255,\s*153,\s*51/gi, 'rgba(37, 99, 235')
    .replace(/rgba\(255,\s*107,\s*0/gi, 'rgba(29, 78, 216');
}

// 1. Process all HTML files in Back/public
const files = fs.readdirSync(publicDir);
files.forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const updated = replaceOrangeWithBlue(content);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated theme in ${file}`);
  }
});

// 2. Process css/style.css if exists
const cssPath = path.join(publicDir, 'css', 'style.css');
if (fs.existsSync(cssPath)) {
  let cssContent = fs.readFileSync(cssPath, 'utf8');
  const updatedCss = replaceOrangeWithBlue(cssContent);
  fs.writeFileSync(cssPath, updatedCss, 'utf8');
  console.log('Updated theme in css/style.css');
}

console.log('Backend Theme Blue Conversion Completed Successfully!');
