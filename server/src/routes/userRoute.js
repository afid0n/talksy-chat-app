const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const upload = uploadMiddleware("userImages");


// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Get user by email
router.get('/email/:email', userController.getUserByEmail);

// Register user
router.post('/', upload.single("profileImage"), userController.registerUser);

//Verify Email
router.get("/verify-email", userController.verifyEmail);


// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;