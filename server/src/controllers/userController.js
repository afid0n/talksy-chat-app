const userService = require('../services/userService');
const { sendVerificationEmail } = require('../services/emailService'); 
const bcrypt = require("bcrypt"); 
const { CLIENT_URL } = require("../config/config");
const { generateToken } = require("../utils/jwt");



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

const registerUser = async (req, res, next) => {
  try {
    //password hash
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (req.file && req.file.path) {
      req.body.profileImage = req.file.path;
      req.body.public_id = req.file.filename;
    }
    const response = await register({
      ...req.body,
      password: hashedPassword,
    });
    if (!response.success) {
      throw new Error(response.message);
    }

    //send email service ...
    const token = generateToken({
      id: response.data._id,
      email: req.body.email,
      fullName: req.body.fullName,
    });
    const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
    sendVerificationEmail(req.body.email, req.body.fullName, verificationLink);

    res.status(201).json({
      message: "user registered successfully | verify your email",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};


const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    //call your service here!
    const response = await verifyEmailToken (token); //success, message
    res.redirect(`${CLIENT_URL}/email-verified?message=${response.message}`);
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };
    const response = await loginService(credentials);
    res.status(200).json({
      message: response.message,
      token: response.token,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
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

module.exports = {
  getUserById,
  getUserByEmail,
  getAllUsers,
  registerUser,
  login,
  verifyEmail,
  updateUser,
  deleteUser,
};