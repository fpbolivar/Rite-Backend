let mongoose = require('mongoose');

let bookingSchema = new mongoose.Schema({

    businesRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    vendorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: {
        bookedDates: [Date],
        startTime: Date,
        endTime: Date,
        address: {
            country: String,
            city: String,

        },
        eventType: String,
        message: String
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'paid', 'not_paid', 'rejected'],
        default: 'pending',
    },

    price: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    payment: {
        type: {
            type: String,
            enum: ['cash', 'card', 'paypal', 'bank_transfer'],
            default: 'cash'
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'not_paid'],
            default: 'pending'
        }
    },



}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);