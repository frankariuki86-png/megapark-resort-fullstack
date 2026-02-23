#!/usr/bin/env node

/**
 * Quick System Health Check
 */

async function checkEndpoint(url) {
  try {
    const res = await fetch(url, { timeout: 3000 });
    return res.status;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('\n🏥 MEGAPARK HEALTH CHECK\n');

  // Check backend
  const backendStatus = await checkEndpoint('http://localhost:3000/api/health');
  if (backendStatus === 200) {
    console.log('✅ Backend: Running on port 3000');
  } else {
    console.log('❌ Backend: Not running on port 3000');
  }

  // Check frontend
  const frontendStatus = await checkEndpoint('http://localhost:5174/megapark-hotel/');
  if (frontendStatus === 200) {
    console.log('✅ Frontend: Running on port 5174');
  } else {
    console.log('❌ Frontend: Not running on port 5174');
  }

  console.log('\nTo start servers:');
  console.log('  Backend:  cd backend && npm run dev');
  console.log('  Frontend: cd frontend && npm run dev');
}

main();
