let mongoose = require('mongoose');

let conversationSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdFor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        businessReff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
        },

        blockedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        categoryReff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default : null
        },
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
            }
        ]

    },
    { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
