const chatService = require('../services/chatService');

const getChatById = async (req, res, next) => {
  try {
    const chat = await chatService.getChatById(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

const getChatsForUser = async (req, res, next) => {
  try {
    const chats = await chatService.getChatsForUser(req.params.userId);
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

const createChat = async (req, res, next) => {
  try {
    const chat = await chatService.createChat(req.body);
    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
};

const updateChat = async (req, res, next) => {
  try {
    const chat = await chatService.updateChat(req.params.id, req.body);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const chat = await chatService.deleteChat(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json({ message: 'Chat deleted', chat });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChatById,
  getChatsForUser,
  createChat,
  updateChat,
  deleteChat,
};