async function testEnquiryPost() {
  try {
    const res = await fetch('http://localhost:3000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Citizen',
        email: 'testcitizen@gmail.com',
        phone: '9876543210',
        subject: 'Swarna Bharat Scheme Enquiry',
        message: 'This is a test enquiry to verify frontend saving functionality.'
      })
    });
    console.log('HTTP Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testEnquiryPost();
