const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // group admin
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    deleted: { type: Boolean, default: false },
avatar: {
    url: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/026/019/617/non_2x/group-profile-avatar-icon-default-social-media-forum-profile-photo-vector.jpg"
    },
    public_id: {
        type: String,
        default: ""
    }
},
}, { timestamps: true });

module.exports = chatSchema;