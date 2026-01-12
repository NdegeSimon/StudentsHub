import { login, register, verifyToken, logout } from './utils/auth';

// Test authentication flow
async function testAuth() {
  console.log('Testing authentication...');
  
  // Test 1: Register a new user
  console.log('\n1. Testing registration:');
  const registerResult = await register({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'jobseeker'
  });
  
  console.log('Registration result:', registerResult);
  
  if (!registerResult.success) {
    // Test 2: Try login if registration fails (user might exist)
    console.log('\n2. Testing login:');
    const loginResult = await login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login result:', loginResult);
    
    if (loginResult.success) {
      // Test 3: Verify token
      console.log('\n3. Testing token verification:');
      const tokenValid = await verifyToken();
      console.log('Token valid:', tokenValid);
      
      // Test 4: Logout
      console.log('\n4. Testing logout:');
      logout();
      console.log('Logged out successfully');
    }
  }
}

// Run test
testAuth();