const express = require("express");
const cors = require("cors");
const errorHandler = require("./src/middlewares/errorHandler");
const path = require("path");

const session = require("express-session");
const passport = require("passport");
require("./src/config/passport");

const userRoute = require("./src/routes/userRoute");
const chatRoutes = require("./src/routes/chatRoute");
const messageRoutes = require("./src/routes/messageRoute");
const googleAuthRoute = require("./src/routes/googleAuthRoute");
const { CLIENT_URL } = require("./src/config/config");

const app = express();

// Setup CORS
app.use(cors({
  origin: CLIENT_URL, // your frontend URL
  credentials: true, // enable cookies to be sent
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Session and Passport MUST come before routes
app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "src/views/index.html"));
});

// ✅ Routes
app.use("/users", userRoute);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/auth", googleAuthRoute); // MUST come after session & passport

// Global error handler
app.use(errorHandler);

module.exports = app;
