const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const upload = uploadMiddleware("userImages");

// Get all users
router.get('/', userController.getAllUsers);

router.post("/login", userController.login)

// Get user by ID
router.get('/:id', userController.getUserById);

// Get user by email
router.get('/email/:email', userController.getUserByEmail);

// Register user
router.post('/register', upload.single("profileImage"), userController.registerUser);

//Verify Email
router.get("/verify-email", userController.verifyEmail);

// Login user
// router.post('/login', login);

// Update user
router.patch('/:id', userController.updateUser);
// update password
router.patch('/password/:id', userController.changePassword);


// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;