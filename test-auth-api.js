/**
 * API Test Script for Megapark Hotel
 * Tests user registration, login, and admin authentication
 */

const API_BASE = 'http://localhost:3000/api';

// Test Helper
async function testEndpoint(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const json = await response.json();
    
    console.log(`\n[${method}] ${endpoint}`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(json, null, 2));
    
    return { status: response.status, data: json };
  } catch (error) {
    console.error(`Error testing ${endpoint}:`, error);
    return { status: 0, error: error.message };
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('MEGAPARK HOTEL - API TEST SUITE');
  console.log('='.repeat(60));

  // Test 1: User Registration
  console.log('\n📝 TEST 1: USER REGISTRATION');
  console.log('-'.repeat(60));
  const registerResult = await testEndpoint('POST', '/auth/register', {
    email: 'testuser@megapark.com',
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+254712345678'
  });

  // Test 2: User Registration with existing email
  console.log('\n📝 TEST 2: DUPLICATE REGISTRATION');
  console.log('-'.repeat(60));
  await testEndpoint('POST', '/auth/register', {
    email: 'testuser@megapark.com',
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+254712345678'
  });

  // Test 3: User Login
  console.log('\n📝 TEST 3: USER LOGIN');
  console.log('-'.repeat(60));
  const loginResult = await testEndpoint('POST', '/auth/login', {
    email: 'testuser@megapark.com',
    password: 'TestPassword123'
  });

  // Test 4: Admin Login
  console.log('\n📝 TEST 4: ADMIN LOGIN');
  console.log('-'.repeat(60));
  const adminLoginResult = await testEndpoint('POST', '/auth/login', {
    email: 'admin@megapark.com',
    password: 'admin123'
  });

  // Test 5: Invalid Credentials
  console.log('\n📝 TEST 5: INVALID LOGIN');
  console.log('-'.repeat(60));
  await testEndpoint('POST', '/auth/login', {
    email: 'testuser@megapark.com',
    password: 'WrongPassword'
  });

  // Test 6: Weak Password
  console.log('\n📝 TEST 6: WEAK PASSWORD (should fail)');
  console.log('-'.repeat(60));
  await testEndpoint('POST', '/auth/register', {
    email: 'weak@megapark.com',
    password: 'weak',
    firstName: 'Test',
    lastName: 'User',
    phone: '+254712345678'
  });

  console.log('\n' + '='.repeat(60));
  console.log('TESTS COMPLETE');
  console.log('='.repeat(60));
}

runTests().catch(console.error);
