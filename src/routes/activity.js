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

router.get('/activity/edit-activity/:dayNumber/:activityNum',  isAuthenticated, async (req, res) => {            
    let {dayNumber, activityNum} = req.params;    
    // console.log(activityNum, dayNumber);
    let activity = await Routine.findOne({"user" : req.user._id.toString()})
    .then( data => {
            let activityToReturn;
            // console.log(data.weekDays)
            data.weekDays.map( day => {
                if(day.dayNumber === parseInt(dayNumber))
                {
                    activityToReturn = day.activities.filter( d => { if(parseInt(activityNum) == d.activitiyNumber) { return d; } });
                }
                //return day;
            })
            return activityToReturn[0];
        }
        ).catch(err => console.error(err));
        
    // console.log(activity);
    res.render('activity/edit-activity', {id : dayNumber, activity : activity});
});

router.get('/activity/mark-as-done/:dayNumber/:activityNum', isAuthenticated, async (req, res) => {            
    let id = req.params.id;
    let {dayNumber, activityNum} = req.params; 
    let routineToUpdate = await Routine.findOne({"user" : req.user._id.toString()})
    .then( data => {
            data.weekDays.map( day => {
                if(day.dayNumber === parseInt(dayNumber))
                {
                    day.activities = day.activities.map( d => { if(parseInt(activityNum) == d.activitiyNumber) {   d.state = !d.state; } return d;});
                }
                return day;
            })
            return data;
        }
        ).catch(err => console.error(err));
    
    await Routine.findOneAndUpdate({"user" : routineToUpdate.user}, routineToUpdate);    

    // console.log(routineToUpdate);
    // console.log(routineToUpdate.weekDays[parseInt(dayNumber-1)]);
    req.flash('success_msg', "Your activity was marked as done successfully! :D")
    res.redirect(`/routines/check-routine/${dayNumber}`);
});

router.put('/activity/edit-activity/:dayNumber/:activityNum',  isAuthenticated, async (req, res) => {            
    let {dayNumber, activityNum} = req.params; 
    const {dayId, startTime, endTime, description, tag} = req.body;    

    let errors = [];

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

    if(errors.length > 0)
    {
        res.render('activity/new-activity', {errors, id : dayId, startTime, endTime, description, tag});
    } else
    {
        const routineToUpdate = await Routine.findOne({"user" : req.user._id.toString()})
        .then( data => {
                data.weekDays.map( day => {
                    if(day.dayNumber === parseInt(dayNumber))
                    {
                        day.activities = day.activities.
                                                map( d => 
                                                { 
                                                    if(parseInt(activityNum) == d.activitiyNumber) 
                                                    {   d = 
                                                        {
                                                            activitiyNumber : parseInt(activityNum),
                                                            description : description,
                                                            startTime : startTime,
                                                            finishTime : endTime,                                                    
                                                            state : d.state,
                                                            tag : tag
                                                        } 
                                                    } 
                                                    return d;
                                                });
                    }
                    return day;
                })
                return data;
            }
            ).catch(err => console.error(err));
        
        await Routine.findOneAndUpdate({"user" : routineToUpdate.user}, routineToUpdate);    

        // console.log(routineToUpdate);
        // console.log(routineToUpdate.weekDays[parseInt(dayNumber-1)]);
        req.flash('success_msg', "Your activity was updated successfully! :D")
        res.redirect(`/routines/check-routine/${dayNumber}`);
    }    
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
                                    state : false,
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
            res.redirect(`/routines/check-routine/${dayId}`);
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
    res.redirect(`/routines/check-routine/${dayNumber}`);
});

module.exports = router;