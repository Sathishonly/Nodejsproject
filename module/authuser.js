const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'], 
        unique: [true, 'Email must be unique'], 
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] 
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
     
        validate: {
            validator: function(value) {
                return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(value);
            },
            message: 'Password must contain at least one letter and one number'
        }
    }
});


module.exports = mongoose.model("authuser",userSchema);