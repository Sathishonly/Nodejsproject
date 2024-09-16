const mongoose = require("mongoose");


const phoneValidator = (phone) => {
    return /^\d{10}$/.test(phone);
};

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    phonenumber: {
        type: String, 
        required: [true, 'Phone number is required'],
        validate: {
            validator: phoneValidator, 
            message: 'Phone number must be exactly 10 digits'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    }
});

module.exports = mongoose.model("User", userSchema);
