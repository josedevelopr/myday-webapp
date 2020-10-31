const express = require('express')
const router = express.Router()
const moment = require('moment');
const passport = require('passport')

const User = require('../models/User')
const Routine = require('../models/Routine');
const weekRoutineDays = require('../helpers/days');

router.get('/users/signin', (req, res) => {    
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {    
    successRedirect: '/main', //indicando a donde se redireccionara luego del success
    failureRedirect: '/users/signin',//indicando a donde se redireccionara luego del failure
    failureFlash : true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    // console.log(req.body);
    const {username, email, password, confirmPassword} = req.body;
    const errors = [];

    if(username.length == 0)
    {
        errors.push({text : 'Please insert your username'});
    }

    if(email.length == 0)
    {
        errors.push({text : 'Please insert your email'});
    }

    if(password.length == 0)
    {
        errors.push({text : 'Please insert your password'});
    }

    if(confirmPassword.length == 0)
    {
        errors.push({text : 'Please confirm your password'});
    }

    if(password!=confirmPassword)
    {
        errors.push({text : 'Passwords do not match'});
    }

    if(errors.length > 0)
    {
        res.render('users/signup', {errors, username, email, password, confirmPassword});
    } else
    {
        const existsEmail = await User.findOne({email : email});
        if(existsEmail)
        {
            req.flash('error_msg','The email is already registered :(');    
            res.redirect('/users/signup');    
        } else
        {
            const newUser = new User({
                                        user : username, 
                                        email : email,
                                        password : password
                                    });

            newUser.password = await newUser.encryptPassord(password);
            
            // Filling in routine weekDays
            let newWeekDays = [];
            weekRoutineDays.map( day => {
                newWeekDays.push({
                    dayNumber : day.numberDay,
                    name : day.name,
                    lastDateChange : moment().format(),
                    activities : []
                })
            });

            const newRoutine = Routine({
                                        user : newUser._id,
                                        weekDays : newWeekDays
                                    });
            // console.log(newRoutine);

            const successRegister = await newUser.save();
            const succesRoutinRegister = await newRoutine.save();
            // console.log("REGISTER :", successRegister, succesRoutinRegister);
            req.flash('success_msg','You are now registered! Please log in :D');
            res.redirect('/');
        }        
    }
});

router.get('/users/complete-register', (req, res) => {    
    res.render('users/completeRegister');
});

router.post('/users/complete-register', async (req, res) => {    
    const {firstName, lastName, birthday, sex} = req.body;
    // console.log(req.body);
    await User.findByIdAndUpdate(req.user._id, {
                                                    firstName : firstName,
                                                    lastName : lastName,
                                                    birthday : birthday,
                                                    sex : sex,
                                                    registerCompleted : true
                                                });
    req.flash('success_msg', 'Your user information is now completed! :D');
    res.redirect('/main');
});

router.get('/users/logout',(req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;