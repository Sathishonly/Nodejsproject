const authuser = require("../module/authuser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const blocklist = require("../module/blocklist");


exports.register = async (req, res) => {
    const { email, password } = req.body;
    console.log(`email : ${email} , password : ${password}`);
    try {
        const user = await authuser.findOne({ email: email });
        console.log(`user : ${user}`);

        if (user) {
            return res.status(400).json({ "status_code": 400, "message": "email already exits" });
        }

        let hashpassword = await bcrypt.hash(password, 10);

        const auth = new authuser({
            email,
            password: hashpassword
        });


        await auth.save();

        const token = jwt.sign({ userId: auth._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ "status_code": 200, "message": "user register successfully", "token": token });
    } catch (error) {
        res.status(400).json({ "status_code": 400, "message": error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`email : ${email} , password : ${password}`)
    try {
        const user = await authuser.findOne({ email: email });
        console.log(`user : ${user}`);

        if (!user) {
            return res.status(400).json({ "status_code": 400, "message": "User not found" });
        }

        var ismatch = await bcrypt.compare(password, user.password);

        if (!ismatch) {
            return res.status(400).json({ "status_code": 400, "message": "Invalid creditials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ "status_code": 400, "message": "login successfully", "token": token });
    } catch (error) {
        res.status(400).json({ "status_code": 400, "message": error.message });
    }
};



exports.logout = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ "status_code": 400, message: "Token is required" });
    }
    console.log(`token : ${token}`)
    const splittoken = token.split(' ')[1];
    try {
        const decodetoken = jwt.decode(splittoken);
        console.log(`decodetoken : ${decodetoken}`);

        const blocklists = new blocklist({
            token: splittoken,
            exp: new Date(decodetoken.exp * 1000)
        });

        await blocklists.save();

        return res.status(200).json({ "status_code": 200, message: "Logout successfully" });
    } catch (error) {
        return res.status(400).json({ "status_code": 400, message: error.message });
    }
};