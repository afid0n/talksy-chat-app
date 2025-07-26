const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Listen for joinRoom from this socket
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Listen for sendMessage from this socket
    socket.on("sendMessage", async (data) => {
      try {
        // data should have: chatId, senderId, content, type (text/gif), createdAt?

        // Create the message document in MongoDB
        const newMessage = await Message.create({
          chat: data.chatId,
          sender: data.senderId,
          content: data.content,
          type: data.type || "text",
          createdAt: data.createdAt || new Date(),
        });

        // Update the chat's lastMessage to this new message
        await Chat.findByIdAndUpdate(data.chatId, { lastMessage: newMessage._id });

        // Prepare message object to send to clients
        const messageToSend = {
          _id: newMessage._id,
          chat: newMessage.chat.toString(),
          sender: newMessage.sender.toString(),
          content: newMessage.content,
          type: newMessage.type,
          createdAt: newMessage.createdAt,
        };

        // Broadcast to everyone in the room (chatId)
        io.to(data.chatId).emit("receiveMessage", messageToSend);
      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
