const mongoose = require("mongoose")
const Checklist = require('../checklistModel')


const userSchema = mongoose.Schema({
    fullname: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    profilePic: String,
    salt: String,
    password: String,
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    resetPasswordGeneratedAt: {
        type: Date
    },
    agreed_to_policies: {
        type: Boolean,
        default: false
    },
    onlineStatus: {
        type: Boolean,
        default: false
    },
    agreed_to_policy_version: {
        type: String
    },
    forgetPasswordOTP: {
        type: String,
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    checklist: [{
        type: mongoose.Types.ObjectId, ref: 'Checklist'
    }],
    wishlist: [{
        type: mongoose.Types.ObjectId, ref: 'Business'
    }],

    accountStatus: {
        type: String,
        enum: ['active', 'freezed', 'suspended', 'deactivated'],
        default: 'active',
    },
}, { timestamps: true })


const User = mongoose.model('User', userSchema)
module.exports = User;