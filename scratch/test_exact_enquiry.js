const fetch = globalThis.fetch;

async function testExactForm() {
  const formData = {
    name: 'Ramesh Sharma',
    email: 'ramesh@gmail.com',
    phone: '9876543210',
    subject: 'Governance Suggestion',
    message: 'We need better digital kiosks in panchayat offices.'
  };

  try {
    const res = await fetch('http://localhost:3000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    console.log('STATUS:', res.status);
    const text = await res.text();
    console.log('BODY:', text);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

testExactForm();
