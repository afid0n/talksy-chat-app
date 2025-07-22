const messageService = require('../services/messageSevice');

const getMessageById = async (req, res, next) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

const getMessagesForChat = async (req, res, next) => {
  try {
    const messages = await messageService.getMessagesForChat(req.params.chatId);
    res.json({
      message: messages ? 'Messages retrieved successfully' : 'No messages found for this chat',
    });
  } catch (err) {
    next(err);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const message = await messageService.createMessage(req.body);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const message = await messageService.updateMessage(req.params.id, req.body);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await messageService.deleteMessage(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted', message });
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getMessages();
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getMessageById,
  getMessagesForChat,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessages
};