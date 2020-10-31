const express = require('express')
const url = require('url');
const router = express.Router()

const Routine = require('../models/Routine');
const {isAuthenticated} = require('../helpers/auth');
const {weekRoutineDays} = require('../helpers/days');

router.get('/main', isAuthenticated, (req, res) => {        
    //    console.log('days', weekRoutineDays)
    if(req.user)
    {
        if(!req.user.registerCompleted)
        {
            if(url.parse(req.url).query)
            {
                // const params = url.parse(req.url).query;       
                // eval(params);                         
                res.render('main/main', {routineDays : weekRoutineDays});
            } else
            {
                res.redirect('/users/complete-register');
            }            
        } else
        {
            res.render('main/main', {routineDays : weekRoutineDays});
        }

    } else
    {
        res.render('main/main', {routineDays : weekRoutineDays});
    }            
});

module.exports = router;