const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middlewares/authToken');
const messageRouter = require('../routes/messageRoute');

// ✅ 1. Specific route first to avoid conflict
router.post('/with-user', verifyToken, chatController.getOrCreateChatWithUser);


// ✅ 2. Get all chats for the user
router.get('/', verifyToken, chatController.getChatsForUser);

// ✅ 3. Get chat by ID
router.get('/:id', verifyToken, chatController.getChatById);

// ✅ 4. Create chat
router.post('/', verifyToken, chatController.createChat);

// ✅ 5. Update chat
router.put('/:id', verifyToken, chatController.updateChat);

// ✅ 6. Delete chat
router.delete('/:id', verifyToken, chatController.deleteChat);

// ✅ 7. Nested message routes for a specific chat
router.use('/:chatId/messages', messageRouter);

module.exports = router;
