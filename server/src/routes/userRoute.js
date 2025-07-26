const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const  verifyAccessToken  = require('../middlewares/authToken');

const verifyToken = require('../middlewares/authToken');
const upload = uploadMiddleware("userImages");

// Register user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.login);

// Verify email
router.get('/verify-email', userController.verifyEmail);
router.post("/resend-verification-email", userController.resendVerificationEmail);

// Get user by email
router.get('/email/:email', userController.getUserByEmail);

// Get all users
router.get('/', userController.getAllUsers);

router.get("/me", verifyToken, userController.getCurrentUser);

// Update user
router.patch('/:id', userController.updateUser);
// update password
router.patch('/password/:id', userController.changePassword);


// Delete user
router.delete('/:id', userController.deleteUser);

// Get user by ID 
router.get('/:id', userController.getUserById);

// Forgot password  
router.post('/forgot-password', userController.forgotPassword);
// Reset password   
router.post('/reset-password', userController.resetPassword);

router.post('/send-request/:targetId', verifyAccessToken, userController.sendFriendRequest);
router.post('/accept-request/:requesterId', verifyAccessToken, userController.acceptFriendRequest);

module.exports = router;