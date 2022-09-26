const mongoose  = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/test";

const connectToMongo = ()=>{

    
    mongoose.connect(mongoURI,(err)=>{
      
        if(err){
            console.log(err);
        }
        else{
        console.log("connected to mongo successfully");
        }
    });}
    



module.exports = connectToMongo;