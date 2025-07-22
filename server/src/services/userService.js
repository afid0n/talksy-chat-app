const UserModel = require('../models/userModel');
const formatMongoData = require('../utils/formatMongoData');
const { verifyToken } = require("../utils/jwt");


const getUserById = async (id) => {
  const user = await User.findById(id);
  return user ? formatMongoData(user) : null;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? formatMongoData(user) : null;
};

const register = async (payload) => {
  try {
    const { email, username } = payload;
    const existedUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existedUser) {
      return {
        success: false,
        message: "username or email already taken!",
      };
    } else {
      return {
        data: await UserModel.create(payload),
        success: true,
      };
    }
  } catch (error) {
    return error.message || "internal server error!";
  }
};

const verifyEmailToken = async (token) => {
  const isValidToken = verifyToken(token);
  if (isValidToken) {
    const { id } = isValidToken;
    const user = await UserModel.findById(id);
    if (user.emailVerified) {
      return {
        success: false,
        message: "email already has been verified",
      };
    } else {
      user.emailVerified = true;
      await user.save();
      return {
        success: true,
        message: "email has been verified successfully!",
      };
    }
  } else {
    throw new Error("invalid or expired token!");
  }
};

const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  return user ? formatMongoData(user) : null;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user ? formatMongoData(user) : null;
};

const getAllUsers = async () => {
  const users = await User.find();
  return formatMongoData(users);
};

module.exports = {
  getUserById,
  getUserByEmail,
  register,
  verifyEmailToken,
  updateUser,
  deleteUser,
  getAllUsers,
};