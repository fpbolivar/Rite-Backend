let mongoose = require('mongoose');

let messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        businessConversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BusinessConversation',
        },
        brokerConversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BrokerConversation',
        },
        type: {
            type: String,
            enum: ['BUSINESS', 'BROKER']
        },
        images: [String],
        videos: [String],
        docs: [String],
        audios: [String],
        cordinates: {
            lat: String,
            long: String
        },
        content: String,
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
