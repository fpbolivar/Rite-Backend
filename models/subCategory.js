let mongoose = require('mongoose');

let subCategorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }
},{ timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);