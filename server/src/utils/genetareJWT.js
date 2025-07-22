const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = require("../config/config");

const generateAccessToken = (payload, expiresIn = "15m") => {
    return jwt.sign(payload, JWT_ACCESS_SECRET_KEY, { expiresIn });
};

const generateRefreshToken = (payload, expiresIn = "7d") => {
    return jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn });
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET_KEY);
    } catch (err) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET_KEY);
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,

};
