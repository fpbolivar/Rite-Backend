const mongoose = require('mongoose')

const singlechecklistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    categoryReff :{ type: mongoose.Schema.Types.ObjectId, ref: "Category"} ,
    forScreen : String,
    checked : {type : Boolean , default : false}    
})


module.exports = mongoose.model("SingleCheckList" , singlechecklistSchema)