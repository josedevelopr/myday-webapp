const express = require('express')
const router = express.Router()

router.get('/routines',(req,res)=>{
    res.render('routines/all-routines');
});