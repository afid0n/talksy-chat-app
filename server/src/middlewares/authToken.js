const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET_KEY } = require("../config/config");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.split(" ")[1];

  const cookieToken = req.cookies?.token;

  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }

  jwt.verify(token, JWT_ACCESS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token!" });
    }

    req.user = decoded;
    next();
  });
};
