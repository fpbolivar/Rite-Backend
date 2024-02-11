let mongoose = require('mongoose');

let donationSchema = new mongoose.Schema({
    title : String,
    picture : String,
    description :String,
    target : Number,
    achieved : Number,
    donators :[{type: mongoose.Types.ObjectId, ref: 'User' }],
    userReff :{type: mongoose.Types.ObjectId, ref: 'User' },
    funeralReff :{type: mongoose.Types.ObjectId, ref: 'Funeral' },
    status: {type:String , enum:['active' , 'closed'] , default:'active' },
    
},{ timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);