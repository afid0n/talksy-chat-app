const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat', 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'gif'],
    default: 'text'
  },
  content: { 
    type: String, 
    required: true 
  }, 
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
}, { timestamps: true });

module.exports = messageSchema; 