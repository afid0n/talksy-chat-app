const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middlewares/authToken');

// Get all chats for a user
router.get('/', verifyToken,chatController.getChatsForUser);


// Get chat by ID
router.get('/:id', verifyToken,chatController.getChatById);

// Create chat
router.post('/', verifyToken,chatController.createChat);

// Update chat
router.put('/:id', verifyToken,chatController.updateChat);

// Delete chat
router.delete('/:id',verifyToken, chatController.deleteChat);
const messageRouter = require('../routes/messageRoute');

router.use('/:chatId/messages', messageRouter);

// Messages inside a chat


module.exports = router;