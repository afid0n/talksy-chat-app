const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get all chats for a user
router.get('/user/:userId', chatController.getChatsForUser);

// Get chat by ID
router.get('/:id', chatController.getChatById);

// Create chat
router.post('/', chatController.createChat);

// Update chat
router.put('/:id', chatController.updateChat);

// Delete chat
router.delete('/:id', chatController.deleteChat);

module.exports = router;