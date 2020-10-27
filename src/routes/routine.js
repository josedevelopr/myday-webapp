const express = require('express')
const router = express.Router()

const Routine = require('../models/Routine');
const {isAuthenticated} = require('../helpers/auth');

router.get('/routines', isAuthenticated, (req, res) => {        

    if(req.user)
    {
        if(!req.user.registerCompleted)
        {
            res.redirect('/users/complete-register');       
        }        
    }
    res.render('routines/all-routines');
        
});

module.exports = router;