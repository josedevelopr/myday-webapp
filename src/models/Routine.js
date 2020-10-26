const mongoose = require('mongoose');
const Day = require('./Day');
const {Schema} = mongoose;

const RoutineSchema = new Schema({
    user : {type : String},
    weekDays : {type : [Day]}
});

module.exports = mongoose.model('Routine', RoutineSchema)