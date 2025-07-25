const express = require("express");
const cors = require("cors");
const errorHandler = require("./src/middlewares/errorHandler");
const path = require("path");

// Import routes
const userRoute = require("./src/routes/userRoute");
const chatRoutes = require("./src/routes/chatRoute");
const messageRoutes = require("./src/routes/messageRoute");
const googleAuthRoute = require("./src/routes/googleAuthRoute");
const session = require("express-session");
const passport = require("passport");
require("./src/config/passport");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "src/views/index.html"));
});

// Use routes
app.use("/users", userRoute);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(passport.session());
app.use("/auth", googleAuthRoute);

app.use(errorHandler);

module.exports = app;