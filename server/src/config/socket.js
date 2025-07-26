const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    io.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    io.on("sendMessage", async (data) => {
      try {
        const message = await Message.create({
          _id: message._id,
          from: message.sender.toString() === data.senderId ? "me" : "other",
          text: message.content,
          time: message.createdAt,
          isGif: message.type === "gif",
          conversationId: data.chatId
        });

        await Chat.findByIdAndUpdate(data.chatId, { lastMessage: message._id });

        io.to(data.chatId).emit("receiveMessage", message);
      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    io.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
