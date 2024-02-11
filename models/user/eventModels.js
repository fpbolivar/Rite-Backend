const mongoose = require('mongoose')

const eventsSchema = mongoose.Schema({
    title : String,
    date : Date,
    guests : [
        {
            type: mongoose.SchemaTypes.ObjectId, ref : "Guest"
        }
    ],
    funeralReff : {
            type: mongoose.SchemaTypes.ObjectId, ref : "Funeral"
        }
   
    
    
})


module.exports = mongoose.model("Event" , eventsSchema)