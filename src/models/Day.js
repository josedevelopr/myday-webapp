const mongoose = require('mongoose');
const {Schema} = mongoose;

const DaySchema = new Schema({
    dayNumber : {type : Number, required : true},
    name : {type : String, required : true},
    lastDateChange : {type : Date, default : Date.now},
    activities : {type: Array},    
})

module.exports = mongoose.model('Day', DaySchema);