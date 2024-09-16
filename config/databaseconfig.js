const mongoose = require("mongoose");


const dbconnection = async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/myproject");
        console.log("mongodb connected successfully"); 
    } catch (error) {
        console.log("mongodb connected failed :"+ error)
    }
}

module.exports = dbconnection;