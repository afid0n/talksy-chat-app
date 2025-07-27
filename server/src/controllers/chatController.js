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

// Usually get chats for logged in user, so req.user._id, not param
const getChatsForUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const chats = await chatService.getChatsForUser(userId);
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

// Example using async/await and Mongoose-like models

const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

const getMessagesByChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch messages for this chat, sorted by time ascending
    const messages = await Message.find({ chat: chatId })
      .sort({ time: 1 })
      .populate("from", "_id fullName avatarUrl"); // Adjust fields as needed

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

const createMessage = async (req, res) => {
  const { chatId } = req.params;
  const { from, text, time, isGif } = req.body;

  try {
    // Optionally check chat exists
    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = new Message({
      chat: chatId,
      from,
      text,
      time,
      isGif: isGif || false,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save message" });
  }
};


const getOrCreateChatWithUser = async (req, res) => {
  const currentUserId = req.user?._id;

  // Get friendId from the correct place:
  // For POST, likely from req.body.friendId
  const friendId = req.body.friendId;

  if (!currentUserId || !friendId) {
    return res.status(400).json({ message: "Missing user or friendId" });
  }

  try {
    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [currentUserId, friendId], $size: 2 }
    }).populate("participants", "_id fullName avatar");

    if (!chat) {
      chat = new Chat({
        isGroup: false,
        participants: [currentUserId, friendId],
      });
      await chat.save();
      chat = await chat.populate("participants", "_id fullName avatar");
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getOrCreateChatWithUser };






module.exports = {
  getChatById,
  getChatsForUser,
  createChat,
  updateChat,
  deleteChat,
  getMessagesByChat,
  createMessage,
  getOrCreateChatWithUser
};
