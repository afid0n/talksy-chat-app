const messageService = require('../services/messageSevice');
const Message = require('../models/messageModel');

const getMessageById = async (req, res) => {
   try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username fullName avatar")
      .sort("createdAt");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMessagesForChat = async (req, res, next) => {
  try {
    const messages = await messageService.getMessagesForChat(req.params.chatId);
    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this chat' });
    }
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const createMessage = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const message = await messageService.createMessage(req.body);

    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    next(error);
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


const getMessagesByChatId = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "_id fullName avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMessageById,
  getMessagesForChat,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessages,
  getMessagesByChatId
};
