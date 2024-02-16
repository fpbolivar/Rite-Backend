let mongoose = require('mongoose');

const communityMessageSchema = new mongoose.Schema({
    message : {type: String, default : null},
    image : [String],
    likes: Number,
    userReff :{type: mongoose.Types.ObjectId, ref: 'User' },
    commnityReff :{type: mongoose.Types.ObjectId, ref: 'Community' },
    
},{ timestamps: true });

module.exports = mongoose.model('cummunityMessage', communityMessageSchema);