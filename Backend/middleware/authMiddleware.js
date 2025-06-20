const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (process.env.NODE_ENV === 'development') {
    console.log('Auth middleware - Header:', authHeader);
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
  }

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth middleware - No token provided');
    }
    return res.sendStatus(401); // No token
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth middleware - Decoded token:', decoded);
    }
    
    req.user = { 
      id: decoded.userId || decoded.id, // Support both userId and id
      userId: decoded.userId || decoded.id,
      phoneNumber: decoded.phoneNumber 
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth middleware - User set:', req.user);
    }
    next();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth middleware - Token verification failed:', err.message);
    }
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
