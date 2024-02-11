const mongoose = require('mongoose')

const guestSchema = mongoose.Schema({
    name: String,
    email: String,
    picture: String,
    phone: String,
    // events: [
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
    // ],
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Declined'],
        default: 'Pending',
    },


})


module.exports = mongoose.model("Guest", guestSchema)