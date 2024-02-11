const mongoose = require('mongoose')

const guestGuestSchema = mongoose.Schema({
    title : String,
    guests : [
        {type: mongoose.Schema.Types.ObjectId, ref:'Guest'}
    ]
})


module.exports = mongoose.model("GuestGroup" , guestGuestSchema)