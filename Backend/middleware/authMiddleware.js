const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.sendStatus(401); // No token

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    req.user = { 
      id: decoded.userId, // Map userId to id for consistency
      userId: decoded.userId,
      phoneNumber: decoded.phoneNumber 
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
