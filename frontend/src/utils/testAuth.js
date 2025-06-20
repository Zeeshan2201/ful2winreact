const authApi = require('./authApi');

// Test signup
async function testSignup() {
  try {
    console.log('Testing signup...');
    const result = await authApi.signup('Test User 2', '9999999998', 'testpassword123');
    console.log('Signup successful:', result);
  } catch (error) {
    console.error('Signup failed:', error.message);
  }
}

// Test login
async function testLogin() {
  try {
    console.log('Testing login...');
    const result = await authApi.login('9999999999', 'testpassword123');
    console.log('Login successful:', result);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Run tests
testSignup().then(() => testLogin());
