let mongoose = require('mongoose');

let funeralScema = new mongoose.Schema(
    {
        name :String,
        image :String,
        funeral_date : Date,
        starting_time: Date,
        ending_time: Date,
        events : [
            {type: mongoose.Schema.Types.ObjectId,ref: 'Event'}
        ],
        bookings : [
            {type: mongoose.Schema.Types.ObjectId,ref: 'UserBooking'}
        ],
        // guests :[
        //     {type: mongoose.Schema.Types.ObjectId,ref: 'Guest'}
        // ],
        // venue: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Business',
        // },
        // flowers: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Business',
        // },
        // coffin: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Business',
        // },
        // transfortaions: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Business',
        // },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        checklist : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Checklist',
        }],
    
    },
    { timestamps: true }
);

module.exports = mongoose.model('Funeral', funeralScema);
