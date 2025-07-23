const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },

    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    authProvider: {
        type: String,
        enum: ['google', 'github', 'local'],
        required: true,
    },
    password: {
        type: String,
        // Required only if local auth
        required: function () {
            return this.authProvider === 'local';
        },
        minlength: 6,
        select: false,
    },
    birthday: {
        type: Date,
        default: null,
    },
    avatar: {
        url: {
            type: String,
            default:
                'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
        },
        public_id: {
            type: String,
        },
    },
    location: {
        country: { type: String },
        isoCode: { type: String },
    },
    interests: {
        type: [String],
        validate: {
            validator: (arr) => arr.length >= 3 && arr.length <= 5,
            message: 'You must choose between 3 and 5 interests.',
        },
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    lastSeen: {
        type: Date,
        default: Date.now,
    },
    bio: {
        type: String,
        maxlength: 160,
        default: "",
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    language: {
        type: String,
        default: 'en',
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});



module.exports = userSchema;