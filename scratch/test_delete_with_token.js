const path = require('path');
const jwt = require(path.join(__dirname, '../Back/node_modules/jsonwebtoken'));
const fetch = globalThis.fetch;

async function testDeleteWithDirectToken() {
  const token = jwt.sign(
    { id: 1, email: 'admin@nemotype.com', role: 'Admin' },
    process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production'
  );

  console.log('Generated Admin Token:', token);

  const getRes = await fetch('http://localhost:3000/api/enquiries', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const enquiries = await getRes.json();
  console.log('Total Enquiries in DB:', enquiries.length);

  if (enquiries.length > 0) {
    const targetId = enquiries[0].id;
    console.log('Targeting enquiry ID for deletion:', targetId);

    const delRes = await fetch(`http://localhost:3000/api/enquiries/${targetId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('DELETE HTTP Status:', delRes.status);
    const delData = await delRes.json();
    console.log('DELETE Response:', delData);
  }
}

testDeleteWithDirectToken();
