const jwt = require("jsonwebtoken");
const blocklist = require("../module/blocklist");

const auth = async(req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ "status_code": 400, "message": "Token is required" });
    }
    const splittoken = token.split(' ')[1];
    try {
        let iftokenext = await blocklist.findOne({ token: splittoken });
        if (iftokenext) {
            return res.status(400).json({ message: 'Token is blacklisted' });
        }

        const decoded = jwt.verify(splittoken, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        return res.status(400).json({ "status_code": 400, "message": "token is invalid" });
    }

}

module.exports = auth;

