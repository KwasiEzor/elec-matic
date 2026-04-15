// Quick test script for email functionality
// Run: node test-email.js

const testEmailAPI = async () => {
  console.log('\n🧪 Testing Email API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const health = await healthResponse.json();
    console.log('✅ Health:', health);

    // Test 2: API test endpoint
    console.log('\n2️⃣ Testing API test endpoint...');
    const testResponse = await fetch('http://localhost:3001/api/test');
    const test = await testResponse.json();
    console.log('✅ Test:', test);

    // Test 3: Send test email
    console.log('\n3️⃣ Sending test email...');
    const sendResponse = await fetch('http://localhost:3001/api/send-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Invoice #TEST-001',
        body: 'Bonjour,\n\nCeci est un email de test.\n\nCordialement,\nElec-Matic',
        invoiceNumber: 'TEST-001',
        companyName: 'Elec-Matic',
      }),
    });

    const sendResult = await sendResponse.json();
    console.log('✅ Send result:', sendResult);

    if (sendResult.success) {
      console.log('\n🎉 SUCCESS! Email sent to Mailpit');
      console.log('🌐 View in Mailpit:', sendResult.mailpitUrl);
      console.log('\n📝 Next steps:');
      console.log('   1. Open Mailpit: http://localhost:8025');
      console.log('   2. Check the email appeared');
      console.log('   3. Test sending from the app UI');
    } else {
      console.log('\n❌ FAILED:', sendResult.error);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Is email server running? npm run dev:email');
    console.log('   - Is Mailpit running? Check http://localhost:8025');
    console.log('   - Check firewall settings');
  }
};

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ fetch not available. Please use Node.js 18 or higher.');
  process.exit(1);
}

testEmailAPI();
