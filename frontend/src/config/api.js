// API Configuration for both local and production environments
// Set FORCE_PRODUCTION to true to always use hosted services even in development
const FORCE_PRODUCTION = true; // Change to false if you want to use local backend

const API_CONFIG = {
  // Use hosted services when FORCE_PRODUCTION is true, otherwise detect environment
  BASE_URL: (FORCE_PRODUCTION || process.env.NODE_ENV === 'production')
    ? 'https://ful2winreact.onrender.com'  // Your deployed backend URL
    : 'http://localhost:5000',              // Local development URL
    
  // Socket.IO connection URLs
  SOCKET_URL: (FORCE_PRODUCTION || process.env.NODE_ENV === 'production')
    ? 'https://ful2winreact.onrender.com'  // Your deployed backend URL
    : 'http://localhost:5000',              // Local development URL
    
  // Frontend URLs (for CORS and redirects)
  FRONTEND_URL: (FORCE_PRODUCTION || process.env.NODE_ENV === 'production')
    ? 'https://ful2win-u83b.onrender.com'  // Your deployed frontend URL
    : 'http://localhost:5173'               // Local development URL
};

export default API_CONFIG;
