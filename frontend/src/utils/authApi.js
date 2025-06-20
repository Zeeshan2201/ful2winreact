// Environment-aware API base URL
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isLocalhost) {
    return 'http://localhost:5000/api';
  } else {
    return 'https://ful2winreact.onrender.com/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Auth API functions
const authApi = {
  // Login user
  login: async (phoneNumber, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  // Register user
  signup: async (fullName, phoneNumber, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, phoneNumber, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  },

  // Verify token
  verifyToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return response.ok;
  }
};

export default authApi;
