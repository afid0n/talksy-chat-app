const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET_KEY, JWT_SECRET_KEY } = require("../config/config");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.json({ message: "no token provided!", statusCode: 401 });

  jwt.verify(token, JWT_ACCESS_SECRET_KEY, (err, decoded) => {
    if (err)
      return res.json({
        message: "invalid or expired token!",
        statusCode: 403, //forbidden
      });
    req.user = decoded; //id, email, fullName, role
    next();
  });
};


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};


module.exports = verifyToken;