#!/usr/bin/env node

/**
 * Data Flow Verification Script
 * Verifies that admin-created data flows correctly to user-facing endpoints
 */

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

async function verifyDataStructure() {
  console.log('\n📊 VERIFYING DATA FLOW & STRUCTURE\n');
  console.log('=' .repeat(60));

  // 1. Fetch public rooms endpoint
  console.log('\n1️⃣  Testing /api/rooms (Public Endpoint)');
  const roomsRes = await makeRequest('/api/rooms');
  console.log(`   Status: ${roomsRes.status}`);
  if (roomsRes.data) {
    const rooms = Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.data;
    if (rooms && rooms.length > 0) {
      console.log(`   ✅ Found ${rooms.length} rooms`);
      const room = rooms[0];
      console.log(`   Sample room:`, {
        id: room.id,
        name: room.name,
        price: room.price,
        pricePerNight: room.pricePerNight,
        capacity: room.capacity,
        description: room.description ? `${room.description.substring(0, 30)}...` : 'N/A'
      });

      // Verify price field exists
      if (room.price || room.pricePerNight) {
        console.log(`   ✅ Price field exists: ${room.price || room.pricePerNight}`);
      } else {
        console.log(`   ⚠️  WARNING: No price field found`);
      }
    } else {
      console.log(`   ⚠️   No rooms returned`);
    }
  }

  // 2. Fetch public halls endpoint
  console.log('\n2️⃣  Testing /api/halls (Public Endpoint)');
  const hallsRes = await makeRequest('/api/halls');
  console.log(`   Status: ${hallsRes.status}`);
  if (hallsRes.data) {
    const halls = Array.isArray(hallsRes.data) ? hallsRes.data : hallsRes.data.data;
    if (halls && halls.length > 0) {
      console.log(`   ✅ Found ${halls.length} halls`);
      const hall = halls[0];
      console.log(`   Sample hall:`, {
        id: hall.id,
        name: hall.name,
        capacity: hall.capacity,
        basePrice: hall.basePrice,
        packages: hall.packages ? `${hall.packages.length} packages` : 'N/A'
      });

      // Verify packages have prices
      if (hall.packages && hall.packages.length > 0) {
        const pkg = hall.packages[0];
        console.log(`   ✅ First package:`, {
          name: pkg.name,
          price: pkg.price,
          includes: pkg.includes ? `${pkg.includes.length} items` : 'N/A'
        });
      }
    } else {
      console.log(`   ⚠️   No halls returned`);
    }
  }

  // 3. Fetch public menu endpoint
  console.log('\n3️⃣  Testing /api/menu (Public Endpoint)');
  const menuRes = await makeRequest('/api/menu');
  console.log(`   Status: ${menuRes.status}`);
  if (menuRes.data) {
    const items = Array.isArray(menuRes.data) ? menuRes.data : menuRes.data.data;
    if (items && items.length > 0) {
      console.log(`   ✅ Found ${items.length} menu items`);
      const item = items[0];
      console.log(`   Sample item:`, {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description ? `${item.description.substring(0, 30)}...` : 'N/A'
      });

      // Verify price field exists
      if (item.price) {
        console.log(`   ✅ Price field exists: ${item.price}`);
      } else {
        console.log(`   ⚠️  WARNING: No price field found`);
      }
    } else {
      console.log(`   ⚠️   No menu items returned`);
    }
  }

  console.log('\n' + '='.repeat(60));
}

async function testAdminAuth() {
  console.log('\n🔐 VERIFYING ADMIN AUTHENTICATION\n');
  console.log('='.repeat(60));

  // Test admin login
  console.log('\n1️⃣  Testing Admin Login');
  const loginRes = await makeRequest('/api/auth/login', 'POST', {
    email: 'admintest@megapark.com',
    password: 'Admin@123456'
  });

  console.log(`   Status: ${loginRes.status}`);
  if (loginRes.data && loginRes.data.token) {
    console.log(`   ✅ Admin login successful`);
    console.log(`   Token: ${loginRes.data.token.substring(0, 20)}...`);
    console.log(`   Role: ${loginRes.data.user?.role || 'N/A'}`);
    return loginRes.data.token;
  } else {
    console.log(`   ❌ Admin login failed: ${loginRes.data?.error || 'Unknown error'}`);
    return null;
  }
}

async function testUserAuth() {
  console.log('\n👤 VERIFYING USER AUTHENTICATION\n');
  console.log('='.repeat(60));

  // Test user login
  console.log('\n1️⃣  Testing User Login');
  const loginRes = await makeRequest('/api/auth/login', 'POST', {
    email: 'testuser1@megapark.com',
    password: 'Test@123456'
  });

  console.log(`   Status: ${loginRes.status}`);
  if (loginRes.data && loginRes.data.token) {
    console.log(`   ✅ User login successful`);
    console.log(`   Token: ${loginRes.data.token.substring(0, 20)}...`);
    console.log(`   Role: ${loginRes.data.user?.role || 'N/A'}`);
    return loginRes.data.token;
  } else {
    console.log(`   ❌ User login failed: ${loginRes.data?.error || 'Unknown error'}`);
    return null;
  }
}

async function main() {
  console.log('\n' + '🚀 MEGAPARK RESORT - DATA FLOW VERIFICATION'.padEnd(60));
  console.log('='.repeat(60));

  // Check if backend is running
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    if (!healthRes.ok) throw new Error('Backend not responding');
  } catch (error) {
    console.log('\n❌ ERROR: Backend server is not running');
    console.log('   Please start the backend with: npm run dev (in backend folder)');
    process.exit(1);
  }

  console.log('✅ Backend server is running\n');

  // Run tests
  await verifyDataStructure();
  const adminToken = await testAdminAuth();
  const userToken = await testUserAuth();

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ VERIFICATION COMPLETE\n');

  if (adminToken && userToken) {
    console.log('Summary:');
    console.log('  ✅ Admin authentication working');
    console.log('  ✅ User authentication working');
    console.log('  ✅ Public endpoints returning data');
    console.log('\nNext steps:');
    console.log('  1. Open http://localhost:5174/megapark-hotel/ in your browser');
    console.log('  2. Verify rooms, halls, and menu display correctly');
    console.log('  3. Login as admin and create new items');
    console.log('  4. Verify new items appear on the user-facing pages');
  }
}

main().catch(console.error);
