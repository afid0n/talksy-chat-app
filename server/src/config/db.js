
const mongoose = require("mongoose");
const { DB_PASSWORD, PORT, DB_URL } = require("./config");

const connectToDB = (app) => {
  mongoose
    .connect(DB_URL.replace("<db_password>", DB_PASSWORD))
    .then(() => {
      console.log("😏 mongodb connected successfully!");
      app.listen(PORT, () => {
        console.log(`server running on port: ${PORT}`);
      });
    })
    .catch((err) => {
      console.warn("😔 db connection failed: ", err.message);
    });
};

module.exports = connectToDB;