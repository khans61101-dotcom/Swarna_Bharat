const fetch = globalThis.fetch;

async function testDeleteEnquiry() {
  try {
    // 1. Login as Admin
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nemotype.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status);
    const token = loginData.token;

    if (!token) {
      console.error('Failed to get token:', loginData);
      return;
    }

    // 2. Fetch enquiries list to get an ID
    const getRes = await fetch('http://localhost:3000/api/enquiries', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const enquiries = await getRes.json();
    console.log('Total Enquiries in DB:', enquiries.length);

    if (enquiries.length === 0) {
      console.log('No enquiries to delete');
      return;
    }

    const targetId = enquiries[0].id;
    console.log('Targeting enquiry ID for deletion:', targetId);

    // 3. Perform DELETE request
    const delRes = await fetch(`http://localhost:3000/api/enquiries/${targetId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('DELETE HTTP Status:', delRes.status);
    const delData = await delRes.json();
    console.log('DELETE Response:', delData);
  } catch (err) {
    console.error('Error during test:', err);
  }
}

testDeleteEnquiry();
