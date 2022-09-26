
//const connectToMongo = require('./db');
const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{


obj = {

    a :"this is notes",
    num : 6
}    
    res.json(obj);
})


module.exports = router;