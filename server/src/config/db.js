const mongoose = require("mongoose");
const { DB_PASSWORD, DB_URL } = require("./config");

const connectToDB = () =>
  mongoose.connect(DB_URL.replace("<db_password>", DB_PASSWORD));

module.exports = connectToDB;
