const mongoose = require('mongoose')

const dealSchema = mongoose.Schema({
    title : String,
    isDealOn : Boolean ,  
    startDate : Date ,   
    coupenCode : String,
    endDate : Date ,     
    percentageDiscount : Number ,
    priceAfterDiscount : Number , 
})


module.exports = mongoose.model("Deal" , dealSchema)