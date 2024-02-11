const mongoose = require('mongoose')

const communitySchema = mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    type: {
        type: String,
        enum: ["PRIVATE", "PUBILC"],
        default: "PUBILC"
    },
    discusssion: [
        { type: mongoose.Types.ObjectId, ref: 'Messege' }
    ],
    userReff: { type: mongoose.Types.ObjectId, ref: 'User' },
    members: [
        { type: mongoose.Types.ObjectId, ref: 'User' }
    ],
    gallary: {
        images: [String],
        video: [String],
    },
    posts: Number,

},{timestamps : true})


module.exports = mongoose.model("Community", communitySchema)