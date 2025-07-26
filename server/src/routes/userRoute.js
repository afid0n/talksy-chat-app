const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const verifyAccessToken = require('../middlewares/authToken');
const getMessagePreviews = require('../controllers/getChatPreviews');
const verifyToken = require('../middlewares/authToken');
const upload = uploadMiddleware("userImages");

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/verify-email', userController.verifyEmail);
router.post('/resend-verification-email', userController.resendVerificationEmail);
router.get('/email/:email', userController.getUserByEmail);
router.get('/', userController.getAllUsers);
router.get('/me', verifyToken, userController.getCurrentUser);
router.get('/friends', verifyToken, userController.getFriends);
router.get('/chat-previews', verifyToken, getMessagePreviews);
router.post('/send-request/:targetId', verifyAccessToken, userController.sendFriendRequest);
router.post('/accept-request/:requesterId', verifyAccessToken, userController.acceptFriendRequest);
router.post('/cancel-request/:targetId', verifyAccessToken, userController.cancelFriendRequest);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.patch('/password/:id', userController.changePassword);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.delete("/friends/:friendId", verifyToken, userController.removeFriend);

router.get('/:id', userController.getUserById);

module.exports = router;
