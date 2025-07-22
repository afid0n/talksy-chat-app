const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config");

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

module.exports = {
  generateToken,
  verifyToken,
};