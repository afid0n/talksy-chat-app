const User = require('../models/userModel');
const formatMongoData = require('../utils/formatMongoData');
const jwt = require('jsonwebtoken');

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user ? formatMongoData(user) : null;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? formatMongoData(user) : null;
};

const createUser = async (userData) => {
  const user = await User.create(userData);
  return formatMongoData(user);
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

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await User.findOne({password});
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '7d' }
  );

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token
  };
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  loginUser
};