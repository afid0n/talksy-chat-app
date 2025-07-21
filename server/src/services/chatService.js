const Chat = require('../models/chatModel');
const formatMongoData = require('../utils/formatMongoData');

const getChatById = async (id) => {
  const chat = await Chat.findById(id)
    .populate('participants', '-password')
    .populate('admin', '-password')
    .populate('lastMessage');
  return chat ? formatMongoData(chat) : null;
};

const getChatsForUser = async (userId) => {
  const chats = await Chat.find({ participants: userId })
    .populate('participants', '-password')
    .populate('admin', '-password')
    .populate('lastMessage');
  return formatMongoData(chats);
};

const createChat = async (chatData) => {
  const chat = await Chat.create(chatData);
  return formatMongoData(chat);
};

const updateChat = async (id, updateData) => {
  const chat = await Chat.findByIdAndUpdate(id, updateData, { new: true });
  return chat ? formatMongoData(chat) : null;
};

const deleteChat = async (id) => {
  const chat = await Chat.findByIdAndDelete(id);
  return chat ? formatMongoData(chat) : null;
};

module.exports = {
  getChatById,
  getChatsForUser,
  createChat,
  updateChat,
  deleteChat,
};