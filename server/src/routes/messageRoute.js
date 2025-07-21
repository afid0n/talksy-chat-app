const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get all messages for a chat
router.get('/chat/:chatId', messageController.getMessagesForChat);

// Get message by ID
router.get('/:id', messageController.getMessageById);

// Create message
router.post('/', messageController.createMessage);

// Update message
router.put('/:id', messageController.updateMessage);

// Delete message
router.delete('/:id', messageController.deleteMessage);

module.exports = router;