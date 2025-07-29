const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middlewares/authToken');

router.get('/chat/:chatId', verifyToken, messageController.getMessagesByChatId);

router.get('/', messageController.getMessages);

router.delete('/delete-all', messageController.deleteAllMessages);


// Get message by ID
router.get('/:id', messageController.getMessageById);

// Create message
router.post('/', messageController.createMessage);

// Update message
router.put('/:id', messageController.updateMessage);

// Delete message
router.delete('/:id', messageController.deleteMessage);

module.exports = router;