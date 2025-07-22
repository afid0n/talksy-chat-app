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

const createMessage = async (messageData) => {
  const message = await Message.create(messageData);
  return formatMongoData(message);
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