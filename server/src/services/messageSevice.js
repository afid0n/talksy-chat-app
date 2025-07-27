const Message = require('../models/messageModel');
const formatMongoData = require('../utils/formatMongoData');

const getMessageById = async (id) => {
  const message = await Message.findById(id)
    .populate('sender', '-password')
    .populate('replyTo');
  return message ? formatMongoData(message) : null;
};

const getMessagesForChat = async (chatId) => {
  const messages = await Message.find({ chat: chatId })
    .populate('sender', '-password')
    .populate('replyTo')
    .sort({ createdAt: 1 });
  return formatMongoData(messages);
};



const createMessage = async (data) => {
  if (!data) throw new Error("No data passed to createMessage");

  const { chat, sender, content, type = "text", status = "sent" } = data;

  if (!chat || !sender || !content) {
    throw new Error("Missing required fields chat, sender or content");
  }

  // Define a timeframe to consider for duplicates, e.g., last 5 seconds
  const DUPLICATE_WINDOW_SECONDS = 5;
  const timeThreshold = new Date(Date.now() - DUPLICATE_WINDOW_SECONDS * 1000);

  // Check for existing messages that match chat, sender, content, type and are recent
  const duplicate = await Message.findOne({
    chat,
    sender,
    content,
    type,
    createdAt: { $gte: timeThreshold },
  });

  if (duplicate) {
    // Duplicate found within last 5 seconds, return existing message instead of creating new one
    return duplicate;
  }

  // Otherwise create new message
  const newMessage = await Message.create({
    chat,
    sender,
    content,
    type,
    status,
  });

  return newMessage;
};




const updateMessage = async (id, updateData) => {
  const message = await Message.findByIdAndUpdate(id, updateData, { new: true });
  return message ? formatMongoData(message) : null;
};

const deleteMessage = async (id) => {
  const message = await Message.findByIdAndDelete(id);
  return message ? formatMongoData(message) : null;
};

const getMessages = async () => {
  return await Message.find();
};

module.exports = {
  getMessageById,
  getMessagesForChat,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessages
};