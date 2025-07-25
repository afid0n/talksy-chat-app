const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/mailService');
const { SERVER_URL, CLIENT_URL } = require('../config/config');
const User = require('../models/userModel');
const { get } = require('../schemas/userSchema');
const { verifyAccessToken } = require('../utils/genetareJWT');



const registerUser = async (req, res, next) => {
  try {
    const { email, username, fullName, password, authProvider } = req.body;

    if (authProvider === "local") {
      if (!email || !username || !fullName || !password) {
        return res.status(400).json({ message: "All fields are required for local registration" });
      }
    }

    const hashedPassword = authProvider === "local"
      ? await bcrypt.hash(password, 10)
      : undefined;

    const response = await userService.register({
      ...req.body,
      password: hashedPassword,
    });
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }


    const token = generateToken({
      id: response.data._id,
      email,
      fullName,
    });

    const verificationLink = `${SERVER_URL}/users/verify-email?token=${token}`;
    sendVerificationEmail(email, fullName, verificationLink);

    res.status(201).json({
      message: "user registered successfully | verify your email",
      data: response.data,
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    console.log("Looking for user with email:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("User not found for email:", normalizedEmail);
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified." });
    }

    const token = generateToken({ id: user._id, email: user.email, fullName: user.fullName });

    const verificationLink = `${SERVER_URL}/users/verify-email?token=${token}`;

    await sendVerificationEmail(user.email, user.fullName, verificationLink);

    res.json({ success: true, message: "Verification email resent successfully." });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getUserByEmail = async (req, res, next) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};


const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    console.log("Received token:", token);

    const response = await userService.verifyEmailToken(token);
    console.log("Verification result:", response);

    res.redirect(`${CLIENT_URL}/auth/email-verified?message=${encodeURIComponent(response.message)}`);
  } catch (error) {
    console.error("Email verification error:", error.message);
    res.redirect(`${CLIENT_URL}/auth/email-verified?message=${encodeURIComponent(error.message)}`);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const result = await userService.updateUser(userId, updates);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };
    const response = await userService.login(credentials);

    console.log("RESPONSE ON SERVER: ", response);

    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: response.message,
      token: response.accessToken,
    });
  } catch (error) {
    res.json({
      message: error.message || "internal server error",
      statusCode: 401, //unauthorized
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const result = await userService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const { newPassword, token } = req.body;

    console.log("Token:", token);
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.email) {
      throw new Error("Invalid or expired token");
    }

    const email = decoded.email;

    await userService.resetPass(newPassword, email);

    res.status(200).json({
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      location: user.location,
      interests: user.interests,
      birthday: user.birthday,
      avatar: user.avatar,
      authProvider: user.authProvider,
      language: user.language || "en",
      bio: user.bio,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });

  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await userService.forgotPassword(email);
    res.status(200).json({
      message: "reset password email was sent!",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error); // bunu əlavə et
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};


module.exports = {
  getUserById,
  getUserByEmail,
  getAllUsers,
  registerUser,
  login,
  verifyEmail,
  updateUser,
  deleteUser,
  resendVerificationEmail,
  changePassword,
  resetPassword,
  forgotPassword,
  changePassword,
   getCurrentUser
};