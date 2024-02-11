let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    icon: {
        type: String
    },
    // services :[
    //     { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
    // ],
    
    subCategories : [{
        type: mongoose.Types.ObjectId, ref: 'SubCategory'
    }],
    
},{ timestamps: true });

module.exports = mongoose.model('Category', categorySchema);