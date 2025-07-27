const Message = require('../models/messageModel');
const User = require('../models/userModel');

const Chat = require('../models/chatModel');

const getMessagePreviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "friends",
      select: "_id username fullName avatar",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.friends.map(f => f._id);

    const previews = await Promise.all(
      friendIds.map(async (friendId) => {
        // Find last message as before
        const lastMessage = await Message.findOne({
          $or: [
            { sender: userId, receiver: friendId },
            { sender: friendId, receiver: userId },
          ]
        })
          .sort({ createdAt: -1 })
          .limit(1);

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          sender: friendId,
          receiver: userId,
          isRead: false,
        });

        // Find chat document ID between these two participants
        const chat = await Chat.findOne({
          isGroup: false,
          participants: { $all: [userId, friendId], $size: 2 }
        });

        const friend = user.friends.find(f => f._id.toString() === friendId.toString());

        return {
          friendId: friend._id,
          fullName: friend.fullName,
          username: friend.username,
          avatar: friend.avatar,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage?.createdAt || null,
          unreadCount,
          chatId: chat ? chat._id : null,  // Add chatId here
        };
      })
    );

    res.status(200).json(previews);
  } catch (error) {
    console.error("Error fetching message previews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = getMessagePreviews;
