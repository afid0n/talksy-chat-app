const http = require("http");
const { Server } = require("socket.io");
const connectToDB = require("./src/config/db");
const setupSocket = require("./src/config/socket");
const app = require("./app");
const { PORT, CLIENT_URL } = require("./src/config/config");

connectToDB()
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

    setupSocket(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn("😔 DB connection failed:", err.message);
  });
