const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY, JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = require("../config/config");

// Generate Token
const generateToken = (payload, expiresIn = "6h") => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
};

// Verify Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return null;
  }
};

// Generate Access Token
const generateAccessToken = (payload, expiresIn = "15m") => {
  return jwt.sign(payload, JWT_ACCESS_SECRET_KEY, { expiresIn });
};

// Generate Refresh Token
const generateRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn });
};


module.exports = {
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
};