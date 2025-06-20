// API Configuration for both local and production environments
const API_CONFIG = {
  // Automatically detect environment and use appropriate URLs
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://ful2winreact.onrender.com'  // Your deployed backend URL
    : 'http://localhost:5000',              // Local development URL
    
  // Socket.IO connection URLs
  SOCKET_URL: process.env.NODE_ENV === 'production'
    ? 'https://ful2winreact.onrender.com'  // Your deployed backend URL
    : 'http://localhost:5000',              // Local development URL
    
  // Frontend URLs (for CORS and redirects)
  FRONTEND_URL: process.env.NODE_ENV === 'production'
    ? 'https://ful2win-u83b.onrender.com'  // Your deployed frontend URL
    : 'http://localhost:5173'               // Local development URL
};

export default API_CONFIG;
