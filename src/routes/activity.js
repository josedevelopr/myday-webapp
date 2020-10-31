const express = require('express')
const url = require('url');
const moment = require('moment');
const router = express.Router()

const Routine = require('../models/Routine');
const {isAuthenticated} = require('../helpers/auth');
const {weekRoutineDays, isTimeBetween} = require('../helpers/days');

router.get('/activity/new-activity/:id', isAuthenticated, (req, res) => {            
    const id = req.params.id;
    res.render('activity/new-activity', {id : id});
});

router.post('/activity/new-activity', isAuthenticated, async (req, res) => {        
    const errors = [];
    const {dayId, startTime, endTime, description, tag} = req.body;    
    
    if(startTime.length == 0){
        errors.push({text:'Please insert the Start Time'});
    }
    
    if(endTime.length == 0){
        errors.push({text:'Please insert the End Time'});
    }

    if(description.length == 0){
        errors.push({text:'Please insert the description of your new routine detail'});
    }

    if(startTime >= endTime)
    {
        errors.push({text : 'Please the Start Time cannot be higher than the endTime'});
    }
    // console.log(req.body, req.user._id.toString());

    if(errors.length > 0)
    {
        res.render('activity/new-activity', {errors, id : dayId, startTime, endTime, description, tag});
    } else
    {
        const routineToUpdate = await Routine.findOne(
            {
                "user" : req.user._id.toString(),
                "weekDays.dayNumber" : parseInt(dayId),
                // "weekDays" : {
                //     $elemMatch: 
                //     {
                //         "dayNumber" :  parseInt(dayId)
                //     }                    
                // },
            }
        ).then( data => {
                let error = "";
                // console.log(data.weekDays)
                data.weekDays.map( day => {
                    if(day.dayNumber === parseInt(dayId))
                    {
                        // Validating if the new activity does not affect other activities time
                        day.activities.map( activity => {
                            let startTimeIsBetween = isTimeBetween(activity.startTime, activity.finishTime, startTime);
                            let endTimeIsBetween = isTimeBetween(activity.startTime, activity.finishTime, endTime);
                            if(startTimeIsBetween && endTimeIsBetween)
                            {
                                errors.push({text: "Please, change the activity start time and finish time :o"});
                                // return res.render('routines/add-routine-detail', {error, startTime, endTime, description, tag});

                            } else if(startTimeIsBetween)
                            {
                                errors.push({text: "Please, change the activity start time :o"});
                                //return res.render('routines/add-routine-detail', {error, startTime, endTime, description, tag});

                            } else if(endTimeIsBetween)
                            {
                                errors.push({text: "Please, change the activity finish time :o"});
                                // return res.render('routines/add-routine-detail', {error, startTime, endTime, description, tag});
                            }
                        });
                        if(errors.length === 0)
                        {
                            // console.log("updating...");
                            day.activities.push(
                                {
                                    activitiyNumber : day.activities.length+1,
                                    startTime : startTime,
                                    finishTime : endTime,
                                    description : description,
                                    state : 1,
                                    tag : tag,                                    
                                }
                            )
                        }                
                    }
                })
                return data;
            }
            ).catch(err => console.error(err));

        if(errors.length > 0)
        {
            res.render('activity/new-activity', {errors, id : dayId, startTime, endTime, description, tag});
        } else 
        {
            // console.log(routineToUpdate);    
            await Routine.findOneAndUpdate({"user" : routineToUpdate.user}, routineToUpdate);    
            
            req.flash('success_msg', "Your activity was saved successfully! :D")
            res.redirect(`/routines/edit-routine/${dayId}`);
        }
    }
});

router.delete('/activity/delete/:activityNum', isAuthenticated, async (req, res) => {
    let activityNum = req.params.activityNum;
    let {dayNumber} = req.body;
    
    const routineToUpdate = await Routine.findOne(
        {
            "user" : req.user._id.toString(),
        }
    ).then( data => {
            // console.log(data.weekDays)
            data.weekDays.map( day => {
                if(day.dayNumber === parseInt(dayNumber))
                {
                    day.activities = day.activities.filter( d => { if(parseInt(activityNum) !== d.activitiyNumber) { return d; } });
                }
            })
            return data;
        }
        ).catch(err => console.error(err));
    
    await Routine.findOneAndUpdate({"user" : routineToUpdate.user}, routineToUpdate);    

    // console.log(routineToUpdate.weekDays[parseInt(dayNumber)]);
    req.flash('success_msg', "Your activity was deleted successfully! :D")
    res.redirect(`/routines/edit-routine/${dayNumber}`);
});

module.exports = router;