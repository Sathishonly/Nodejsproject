const mongoose = require("mongoose");

const blocklistschema = mongoose.Schema({
    token: { type: String, required: true },
    exp: { type: Date, required: true }
 
});

module.exports = mongoose.model("blocklist", blocklistschema);
