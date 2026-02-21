#!/usr/bin/env node

/**
 * Quick Website Status Check
 * Verifies that backend and frontend are responding
 */

async function checkStatus() {
  console.log('='.repeat(60));
  console.log('MEGAPARK HOTEL - WEBSITE STATUS CHECK');
  console.log('='.repeat(60));
  
  // Check Backend
  console.log('\n🔧 Checking Backend...');
  try {
    const backendResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@megapark.com', password: 'admin123' })
    });
    
    if (backendResponse.ok) {
      const data = await backendResponse.json();
      console.log('   ✅ Backend: RESPONDING & WORKING');
      console.log('   ✅ Admin login successful');
      console.log(`   ✅ JWT Token issued: ${data.accessToken ? 'YES' : 'NO'}`);
    } else {
      console.log('   ✅ Backend: RESPONDING');
      console.log(`   Status: ${backendResponse.status}`);
    }
  } catch (err) {
    console.log(`   ❌ Backend: NOT RESPONDING - ${err.message}`);
  }
  
  // Check Frontend
  console.log('\n🎨 Checking Frontend...');
  try {
    const frontendResponse = await fetch('http://localhost:5173/megapark-hotel/');
    if (frontendResponse.ok) {
      console.log('   ✅ Frontend: RESPONDING');
      console.log('   ✅ Website HTML loaded successfully');
    } else {
      console.log(`   ⚠️  Frontend status: ${frontendResponse.status}`);
    }
  } catch (err) {
    console.log(`   ❌ Frontend: NOT RESPONDING - ${err.message}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('STATUS CHECK COMPLETE');
  console.log('='.repeat(60));
  console.log('\n📍 Access your website at:');
  console.log('   http://localhost:5173/megapark-hotel/');
  console.log('\n👨‍💼 Admin Login:');
  console.log('   Email: admin@megapark.com');
  console.log('   Password: admin123');
  console.log('\n');
}

checkStatus().catch(console.error);
