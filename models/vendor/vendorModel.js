const mongoose = require("mongoose")



const vendorSchema = mongoose.Schema({
    fullname :String,
    email : String,
    phone : String,
    username : String,
    password : String,
    
    totalEarning : Number,
    description: { type: String },
    address: {
        country: String,
        state: String,
        city: String,
        zipCode: String
    },
    
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    resetPasswordGeneratedAt: {
        type: Date
    },
    agreed_to_policies: {
        type: Boolean,
        default: false
    },
    onlineStatus: {
        type: Boolean,
        default: false
    },
    agreed_to_policy_version: {
        type: String
    },
    forgetPasswordOTP: {
        type: String,
    },
    category: {
        type: mongoose.Types.ObjectId, ref: 'Category'
    },
    subCategory: {
        type: mongoose.Types.ObjectId, ref: 'subCategory'
    },
    services: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
    ],
    bookings :[
        { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
    ],
    business :[
        { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
    ],
   
   
    

}, { timestamps: true })




module.exports = mongoose.model('Vendor', vendorSchema)