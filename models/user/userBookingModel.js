const mongoose = require('mongoose')

const userBookingSchema = mongoose.Schema({
    bookingDate: { type: Date, default: null },
    bookingStartTime: { type: Date, default: null },
    bookingEndTime: { type: Date, default: null },
    description: { type: String, default: null },
    userReff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    funeralReff: { type: mongoose.Schema.Types.ObjectId, ref: 'Funeral' },
    businessReff: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    payment: {
        method: { type: String, default: null },
        amount: { type: Number, default: null },
        status: {
            type: String,
            enum: ['pending',  'paid', 'not_paid', 'canceled'],
            default: 'pending',
        },
    }

})


module.exports = mongoose.model("UserBooking", userBookingSchema)