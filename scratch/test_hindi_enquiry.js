const fetch = globalThis.fetch;

async function testHindiPost() {
  try {
    const res = await fetch('http://localhost:3000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'राम कुमार शर्मा',
        email: 'ramkumar@gmail.com',
        phone: '9876543210',
        subject: 'शासन सुझाव',
        message: 'यह एक हिंदी पूछताछ परीक्षण संदेश है।'
      })
    });
    console.log('HTTP Status for Hindi Enquiry:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testHindiPost();
