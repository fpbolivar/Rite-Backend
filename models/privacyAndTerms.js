let mongoose = require('mongoose');

let privacyAndPolicySchema = new mongoose.Schema({
    title: {
        type: String
    },
    priority: {
        type: Number
    },
    description: {
        type: String,
    },
    version: {
        type: String,
       
    },
    for: {
        type: String,
        enum: ['APP', 'WEB' , 'BOTH'],
        default: "BOTH"
    },
    type: {
        type: String,
        enum: ['PRIVACY', 'TERMS'],
        default : "PRIVACY"
    },
    points: [
        {
            title : String,
            description : String,   
            list : [
                {
                    title : String,
                    icon : String
                }
            ]
        }
       ]
    

}, { timestamps: true });

module.exports = mongoose.model('privacyAndTerm', privacyAndPolicySchema);