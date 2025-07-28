const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/mailService');
const { SERVER_URL, CLIENT_URL } = require('../config/config');
const User = require('../models/userModel');
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
// Əgər Cloudinary-ə yeni şəkil yüklənibsə
   if (req.file && req.file.path) {
      updates.profileImage = req.file.path;         
      updates.public_id = req.file.filename;
    }
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

    res.cookie("token", response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax", // more frontend-friendly than "strict"
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: response.message,
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
    const user = await User.findById(req.user.id)
      .select('-password') // don't send password
      .populate('friends', '_id username fullName avatar'); // optional: populate friend info

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      location: user.location,
      interests: user.interests,
      friendRequests: user.friendRequests,
      birthday: user.birthday,
      avatar: user.avatar,
      authProvider: user.authProvider,
      language: user.language || "en",
      bio: user.bio,
      emailVerified: user.emailVerified,
      friends: user.friends?.map(friend => friend._id), // send only IDs
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


const sendFriendRequest = async (req, res, next) => {
  const senderId = req.user.id;
  const targetId = req.params.targetId;

  if (senderId === targetId) {
    return res.status(400).json({ message: "You cannot send a request to yourself." });
  }

  try {
    const [targetUser, senderUser] = await Promise.all([
      User.findById(targetId),
      User.findById(senderId),
    ]);

    if (!targetUser || !senderUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Check if already friends
    if (targetUser.friends.includes(senderId)) {
      return res.status(400).json({ message: "You are already friends." });
    }

    // ✅ Check if request already sent
    if (targetUser.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // ✅ Check if the target user has sent you a request (reverse)
    if (senderUser.friendRequests.includes(targetId)) {
      return res.status(400).json({ message: "This user has already sent you a friend request." });
    }

    // ✅ All good: push request
    targetUser.friendRequests.push(senderId);
    await targetUser.save();

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (err) {
    next(err);
  }
};


const acceptFriendRequest = async (req, res, next) => {
  const receiverId = req.user.id;
  const requesterId = req.params.requesterId;

  if (receiverId === requesterId) {
    return res.status(400).json({ message: "You cannot accept your own request." });
  }

  try {
    const receiver = await User.findById(receiverId);
    const requester = await User.findById(requesterId);

    if (!receiver || !requester) {
      return res.status(404).json({ message: "User not found." });
    }

    // sorğu yoxdursa
    if (!receiver.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No friend request from this user." });
    }

    // əlavə et
    receiver.friends.push(requesterId);
    requester.friends.push(receiverId);

    // sil sorğudan
    receiver.friendRequests = receiver.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await receiver.save();
    await requester.save();

    res.status(200).json({ message: "Friend request accepted." });
  } catch (err) {
    next(err);
  }
};

const cancelFriendRequest = async (req, res, next) => {
  const receiverId = req.user.id;
  const senderId = req.params.senderId;

  console.log( "Receiver ID:", receiverId);
  console.log("Sender ID:", senderId);

  const receiver = await User.findById(receiverId);
  const index = receiver.friendRequests.indexOf(senderId);

  if (index === -1)
    return res.status(400).json({ message: "No such request" });

  receiver.friendRequests.splice(index, 1);
  await receiver.save();

  res.status(200).json({ message: "Request rejected." });
};
;


const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "friends",
      select: "_id username fullName avatar", // only what's needed for messages
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // You can shape the response if needed
    const friendsList = user.friends.map(friend => ({
      id: friend._id,
      username: friend.username,
      fullName: friend.fullName,
      avatar: friend.avatar,
    }));

    res.status(200).json(friendsList);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFriend = async (req, res, next) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  if (userId === friendId) {
    return res.status(400).json({ message: "You cannot remove yourself." });
  }

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if they are friends
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "You are not friends." });
    }

    // Remove friendId from user's friends list
    user.friends = user.friends.filter(id => id.toString() !== friendId.toString());
    // Remove userId from friend's friends list
    friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully." });
  } catch (error) {
    console.error("Remove friend error:", error);
    next(error);
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
  getCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  getFriends
  , removeFriend
};