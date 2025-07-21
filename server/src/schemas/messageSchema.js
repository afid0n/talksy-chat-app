const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'gif'],
    default: 'text'
  },
  content: { type: String }, 
    status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = messageSchema;
