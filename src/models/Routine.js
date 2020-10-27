const mongoose = require('mongoose');
const {Schema} = mongoose;

const RoutineSchema = new Schema({
    user : {type : String},
    weekDays : {type : Array}
});

module.exports = mongoose.model('Routine', RoutineSchema)