let mongoose = require('mongoose');

let customerSupportSchema = new mongoose.Schema({
    name : String,
    email : String,
    type :String,
    issue : String,
    userReff :{type: mongoose.Types.ObjectId, ref: 'User' },
    status: {type:String , enum:['pending' , 'checking' , 'solved'] , default:'pending' },
    files : [String],
    
},{ timestamps: true });

module.exports = mongoose.model('CustomerSupport', customerSupportSchema);