const User = require('../models/userModel');
const formatMongoData = require('../utils/formatMongoData');

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

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
};