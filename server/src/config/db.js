const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { DB_PASSWORD, PORT, DB_URL, CLIENT_URL } = require("./config");

const connectToDB = (app) => {
  mongoose
    .connect(DB_URL.replace("<db_password>", DB_PASSWORD))
    .then(() => {
      console.log("😏 MongoDB connected successfully!");

      const server = http.createServer(app);

      const io = new Server(server, {
        cors: {
          origin: CLIENT_URL,
          methods: ["GET", "POST"],
          credentials: true,
        },
      });

      // Socket.IO logic
      io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        socket.on("sendMessage", (data) => {
          console.log("✉️ Message received:", data);
          io.emit("receiveMessage", data); 
        });

        socket.on("disconnect", () => {
          console.log("🔴 User disconnected:", socket.id);
        });
      });

      // Start server
      server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.warn("😔 DB connection failed:", err.message);
    });
};

module.exports = connectToDB;
