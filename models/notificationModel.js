let mongoose = require('mongoose');

let notificationSchema = new mongoose.Schema({
    message: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default : null
    },
    createdFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default : null
    },
    isRead: {
        type : Boolean,
        default : false
    },
    type: {
        type : String,
        default : 'general'
    },
    icon: {
        type : String,
        default: 'notify_logo.png'
    },
    info: {
        type : String,
        default : null
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        default : null
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default : null
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
        default : null
    },
    childSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "childsubcategory",
        default : null
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        default : null
    },
    notifyId: {
        type : String,
        default : null
    },
   
},{ timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);