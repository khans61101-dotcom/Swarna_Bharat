const http = require('http');

http.get('http://localhost:3000/api/documents', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status Code:', res.statusCode);
    console.log('Response Body:', data);
  });
}).on('error', (err) => {
  console.error('HTTP GET Error:', err.message);
});
