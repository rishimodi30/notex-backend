//const connectToMongo = require('./db');
const express = require('express');
const router = express.Router();
const User  = require('../models/User');

//creating a user using POST "/api/auth/"

router.post('/',async(req,res)=>{
   
    const user = User(req.body);
    user.save();
    console.log(req.body);
    res.send("done");

})
module.exports = router;