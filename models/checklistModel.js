const mongoose = require('mongoose')


const checklistSchema = new mongoose.Schema({
    title: { type: String, default: null },
    isChecked: { type: Boolean, default: false },
    type: {
        type: String , default : null
    },


})

module.exports = mongoose.model("Checklist", checklistSchema)