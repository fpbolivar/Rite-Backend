let mongoose = require('mongoose');
const shortid = require('shortid');

let reportUserSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    reportOption: {
       type : String,
       required : true
    },
    text: {
        type : String,
        default : null
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    refrenceNo: {
        type : String,
        default : shortid.generate
    },
   
},{ timestamps: true });

module.exports = mongoose.model('ReportUser', reportUserSchema);