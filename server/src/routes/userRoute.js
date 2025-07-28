const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const verifyAccessToken = require('../middlewares/authToken');
const getMessagePreviews = require('../controllers/getChatPreviews');
const verifyToken = require('../middlewares/authToken');

const upload = uploadMiddleware("users");

// Logging for debug
console.log("📁 Type of upload:", typeof upload); // should be object
console.log("🧾 Type of upload.single:", typeof upload.single); // should be function

// --- Auth routes ---
router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/verify-email', userController.verifyEmail);
router.post('/resend-verification-email', userController.resendVerificationEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/logout', userController.logoutUser); 

// --- User routes ---
router.get('/email/:email', userController.getUserByEmail);
router.get('/', userController.getAllUsers);
router.get('/me', verifyToken, userController.getCurrentUser);
router.get('/friends', verifyToken, userController.getFriends);
router.get('/chat-previews', verifyToken, getMessagePreviews);

// --- Friend requests ---
router.post('/send-request/:targetId', verifyAccessToken, userController.sendFriendRequest);
router.post('/accept-request/:requesterId', verifyAccessToken, userController.acceptFriendRequest);
router.post('/cancel-request/:senderId', verifyAccessToken, userController.cancelFriendRequest);
router.delete('/friends/:friendId', verifyToken, userController.removeFriend);
router.delete('/delete-account', verifyToken, userController.deleteUser);


// --- User update ---
router.patch('/:id', upload.single("profileImage"), userController.updateUser);
router.patch('/password/:id', userController.changePassword);



router.get('/:id', userController.getUserById);

module.exports = router;
