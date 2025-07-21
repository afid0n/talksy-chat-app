const express = require("express");
const cors = require("cors");
const errorHandler = require("./src/middlewares/errorHandler");
const path = require("path");

// Import routes
const userRoute = require("./src/routes/userRoute");
const chatRoute = require("./src/routes/chatRoute");
const messageRoute = require("./src/routes/messageRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "src/views/index.html"));
});

// Use routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.use(errorHandler);

module.exports = app;