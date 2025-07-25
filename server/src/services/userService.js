const User = require('../models/userModel');
const formatMongoData = require('../utils/formatMongoData');
const { generateAccessToken, generateRefreshToken } = require('../utils/genetareJWT');
const { verifyToken, generateToken } = require("../utils/jwt");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema } = require('../validations/registerValidate');
const {
  sendUnlockAccountEmail,
  sendForgotPasswordEmail,
} = require("../utils/mailService");
const { CLIENT_URL } = require('../config/config');
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 10 * 60 * 1000; //10 minutes

const register = async (payload) => {
  try {
    console.log("🔍 Incoming register payload:", payload);

    const { error } = registerSchema.validate(payload, { abortEarly: false });

    if (error) {
      const validationMessages = error.details.map((d) => d.message);
      return {
        success: false,
        message: `Validation failed: ${validationMessages.join(', ')}`,
      };
    }

    const { email, username } = payload;

    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      return {
        success: false,
        message: 'Username or email already taken!',
      };
    }

    const newUser = await User.create(payload);

    return {
      success: true,
      data: newUser,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: 'Internal server error!',
    };
  }
};


const getUserById = async (id) => {
  const user = await User.findById(id);
  return user ? formatMongoData(user) : null;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? formatMongoData(user) : null;
};



const verifyEmailToken = async (token) => {
  const decoded = verifyToken(token);

  if (!decoded) throw new Error("Invalid or expired token!");

  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found!");

  if (user.emailVerified) {
    return { success: false, message: "Email already verified." };
  }

  user.emailVerified = true;
  await user.save();

  return { success: true, message: "Email verified successfully!" };
};


const login = async (credentials) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials!");
  }

  //is verified
  if (!user.emailVerified) {
    throw new Error("email should be verified first!");
  }

  // Check if locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    const unlockTime = new Date(user.lockUntil).toLocaleString();
    throw new Error(`Account is locked. Try again after ${unlockTime}.`);
  }

  //check user provider (local or email)
  if (user.authProvider !== "local") {
    throw new Error(
      "this account has been created with Google, try Sign In with Google!"
    );
  }

  // Validate password
  // console.log(password, user.password);
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
      await user.save();
      //send email to user to unlock their account
      const token = generateAccessToken(
        {
          id: user._id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          birthday: user.birthday,
          location: user.location,
          interests: user.interests,
        },
        "6h"
      );
      const unlockAccountLink = `${process.env.SERVER_URL}/auth/unlock-account?token=${token}`;
      sendUnlockAccountEmail(user.email, user.fullName, unlockAccountLink);
      throw new Error(
        "Too many login attempts. Account locked for 10 minutes (check your email)"
      );
    }

    await user.save();
    throw new Error("Invalid credentials!");
  }

  // Success: reset loginAttempts, lockUntil, update lastLogin
  user.loginAttempts = 0;
  user.lockUntil = null;
  user.lastLogin = new Date();

  await user.save();
  //implement refresh token
  const accessToken = generateAccessToken({
    email: user.email,
    id: user._id,
    role: user.role,
    profileImage: user.profileImage,
    fullName: user.fullName,
  });
  const refreshToken = generateRefreshToken({
    email: user.email,
    id: user._id,
    role: user.role,
    fullName: user.fullName,
  });

  return {
    message: "login successful",
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const updateUser = async (userId, updates) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Əgər yeni şifrə göndərilibsə, hash et
  if (updates.password) {
    const hashedPassword = await bcrypt.hash(updates.password, 10);
    user.password = hashedPassword;
  }

  // Digər sahələri update et (hər ehtimala qarşı manual)
  if (updates.fullName !== undefined) user.fullName = updates.fullName;
  if (updates.email !== undefined) user.email = updates.email;
  if (updates.phone !== undefined) user.phone = updates.phone;
  if (updates.location !== undefined) user.location = updates.location;
  if (updates.bio !== undefined) user.bio = updates.bio;
  if (updates.profileImage !== undefined) user.profileImage = updates.profileImage;

  await user.save();

  return {
    message: "User updated successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  };
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user ? formatMongoData(user) : null;
};

const getAllUsers = async () => {
  const users = await User.find();
  return formatMongoData(users);
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Əgər currentPassword təqdim olunubsa – doğrula
  if (currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");
  }

  // Yeni parolu hash et və saxla
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  return { message: "Password updated successfully" };
};


const resetPass = async (newPassword, email) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("user not found!");

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  console.log("inside service: ", newPassword);
  user.password = hashedPassword;
  await user.save();
  return user;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new Error("email does not exist!");
  } else {
    //send email
    const token = generateAccessToken(
      {
        id: user._id,
        email: user.email,
      },
      "30m"
    );
    const resetPasswordLink = `${CLIENT_URL}/auth/reset-password?token=${token}`;
    sendForgotPasswordEmail(email, resetPasswordLink);
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  register,
  verifyEmailToken,
  login,
  updateUser,
  deleteUser,
  getAllUsers,
  changePassword,
  resetPass,
  forgotPassword,
};