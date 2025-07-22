const UserModel = require('../models/userModel');
const formatMongoData = require('../utils/formatMongoData');

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
  updateUser,
  deleteUser,
  getAllUsers,
};