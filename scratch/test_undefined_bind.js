const fetch = globalThis.fetch;

async function testUndefinedBind() {
  try {
    const res = await fetch('http://localhost:3000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Citizen',
        email: 'test@example.com',
        // phone is missing/undefined
        // subject is missing/undefined
        message: 'Hello testing enquiry without phone or subject'
      })
    });
    console.log('HTTP Status with missing/undefined fields:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUndefinedBind();
