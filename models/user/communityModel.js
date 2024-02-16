const mongoose = require('mongoose')

const communitySchema = mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    discusssion: [
        { type: mongoose.Types.ObjectId, ref: 'cummunityMessage' }
    ],
    userReff: { type: mongoose.Types.ObjectId, ref: 'User' },
    members: [
        { type: mongoose.Types.ObjectId, ref: 'User' }
    ],
    images: [String],
    posts: Number,

}, { timestamps: true })


module.exports = mongoose.model("Community", communitySchema)