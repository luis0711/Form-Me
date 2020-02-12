const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        min: 6,
        max:255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max:255,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max:1024,
    },
    mailing: {
        type: Boolean,
        default: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    TokenAccount: {
        type: String,
        required: false,
        max:22,
    },
});

module.exports = mongoose.model('User', userSchema);