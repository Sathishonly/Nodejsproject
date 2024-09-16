const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/authcontroller");
const auth = require("../middleware/auth");

//register
router.post('/register', authcontroller.register);

// login
router.post('/login', authcontroller.login);

// logout
router.post('/newlogout', auth, authcontroller.logout);


module.exports = router;