const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const setupSocket = (io) => {
  // Map userId => Set of socketIds
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Listen for userConnected event with userId from client
    socket.on("userConnected", (userId) => {
      socket.userId = userId; // store userId on socket

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      console.log(`User ${userId} connected with socket ${socket.id}`);

      // Broadcast to all clients that user is online
      io.emit("userOnline", userId);

      // Send full online users list to this connected socket
      socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // Join chat room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Leave chat room
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      try {
        if (!data?.chatId || !data?.senderId || !data?.content) {
          console.error("❌ Missing required message fields:", data);
          return;
        }

        // Save message to DB
        const newMessage = await Message.create({
          chat: data.chatId,
          sender: data.senderId,
          content: data.content,
          type: data.type || "text",
          createdAt: data.createdAt || new Date(),
        });

        // Update chat's lastMessage
        await Chat.findByIdAndUpdate(data.chatId, {
          lastMessage: newMessage._id,
        });

        // Prepare message to send to clients
        const messageToSend = {
          _id: newMessage._id,
          chat: newMessage.chat?.toString?.() || data.chatId,
          sender: newMessage.sender?.toString?.() || data.senderId,
          content: newMessage.content,
          type: newMessage.type,
          createdAt: newMessage.createdAt,
        };

        // Emit to room
        io.to(data.chatId).emit("receiveMessage", messageToSend);
      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    // Typing indicators
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { chatId, userId });
    });
    socket.on("stopTyping", ({ chatId, userId }) => {
      socket.to(chatId).emit("stopTyping", { chatId, userId });
    });

    // Handle disconnects and update online users
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);

      if (!socket.userId) return;

      const userSockets = onlineUsers.get(socket.userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
          console.log(`User ${socket.userId} is now offline`);

          // Broadcast offline event to all clients
          io.emit("userOffline", socket.userId);
        }
      }
    });
  });
};

module.exports = setupSocket;
