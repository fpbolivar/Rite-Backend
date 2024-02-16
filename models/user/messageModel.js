let mongoose = require('mongoose');

let messageSchema = new mongoose.Schema(
    {
        senderId:String,
        receiverId: String,
        conversationId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        },
        images: [String],
        message: {type : String , default : null},
        seen: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
