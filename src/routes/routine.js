const express = require('express')
const url = require('url');
const moment = require('moment');
const router = express.Router()

const Routine = require('../models/Routine');
const {isAuthenticated} = require('../helpers/auth');
const {weekRoutineDays, isTimeBetween} = require('../helpers/days');

router.get('/routines', isAuthenticated, (req, res) => {        
    res.render('routines/all-routines', {routineDays : weekRoutineDays});
});

router.get('/routines/edit-routine/:id', isAuthenticated, async (req, res) => {            

    let routineDay = await Routine.findOne({
                                        "user" : req.user._id.toString()        
                                    }).then( data => {
                                        let result = [];
                                        data.weekDays.map( day => {
                                            if(day.dayNumber === parseInt(req.params.id))
                                            {
                                                result = day;
                                            }
                                        });

                                        return result;
                                    });
    if(routineDay.activities.length > 0)
    {
        routineDay.activities = await routineDay.activities.sort( (a, b) => (a.startTime > b.startTime) ? 1 : -1);
    }                                        
    //console.log(routineDay);

    res.render('routines/edit-routine', {
                                            routine : routineDay,
                                            dayNumber : routineDay.dayNumber,
                                        });
});


module.exports = router;