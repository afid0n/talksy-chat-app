require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3030,
  DB_URL: process.env.DB_URL,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  GMAIL_APP_NAME: process.env.GMAIL_APP_NAME,
  GMAIL_USER: process.env.GMAIL_USER,
  SERVER_URL: process.env.SERVER_URL,
  CLIENT_URL: process.env.CLIENT_URL,
};