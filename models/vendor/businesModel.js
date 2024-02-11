const mongoose = require("mongoose")


const businessSchema = mongoose.Schema({
    vendorRef :{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    businessDetails: {
        title: { type: String, required: true },
        description: { type: String },
        email: String,
        website: String,
        phone: String,
    },
    location: {
        address: {
            country: String,
            state: String,
            city: String,
            zipCode: String,
            address: String,
        },
        cordinates: {
            lat: String,
            long: String,
        },
    },
    deal: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Deal'
    },
    gallery: {
        images: [String],
        videos: [String],
    },

    category: {
        type: mongoose.Types.ObjectId, ref: 'Category'
    },
    subCategory: {
        type: mongoose.Types.ObjectId, ref: 'SubCategory'
    },
    services: [ 
        {type : String}
    ],
    lowestPrice: Number,
    boostDetails: {
        isBoosted: Boolean,
        daysInNumber: Number,
        startDate: Date,
        endDate: Date,
        cost: Number,
        status: {
            type: String,
            enum: ['pending', 'active', 'paid', 'not_paid', 'rejected'],
            default: 'pending',
        },
    },

    status: {
        type: String,
        enum: ['pending', 'active', 'approved', 'rejected'],
        default: 'active',
    },
    socialLinks: [
        {
            title: String,
            link: String,
        }
    ],

}, { timestamps: true })



module.exports = mongoose.model('Business', businessSchema)