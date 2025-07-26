const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middlewares/authToken');
const messageRouter = require('../routes/messageRoute');


router.get('/private/:userId', verifyToken, chatController.getOrCreateChatWithUser);

// Get all chats for a user
router.get('/', verifyToken, chatController.getChatsForUser);

// Get chat by ID
router.get('/:id', verifyToken, chatController.getChatById);

// Create chat
router.post('/', verifyToken, chatController.createChat);

// Update chat
router.put('/:id', verifyToken, chatController.updateChat);

// Delete chat
router.delete('/:id', verifyToken, chatController.deleteChat);

// Messages inside a chat
router.use('/:chatId/messages', messageRouter);

module.exports = router;
