const mongoose = require('mongoose');
const {Schema} = mongoose;

const ActivitySchema = new Schema({
    activitiyNumber: {type : Number, required : true},
    startTime : {type : Date, required : true},
    finishTime : {type : Date, required : true},
    description : {type : String, required : true},
    state : {type : String, required : true},
    tag : {type : Array}
});

module.exports = mongoose.model('Activity', ActivitySchema);