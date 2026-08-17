const fetch = globalThis.fetch;

async function checkHealth() {
  try {
    const res = await fetch('http://localhost:3000/health');
    console.log('Health Status:', res.status);
    const data = await res.json();
    console.log('Health Data:', data);
  } catch (err) {
    console.error('Health Check Error:', err.message);
  }
}

checkHealth();
