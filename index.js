require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const dbconnection = require("./config/databaseconfig");
const userroutes = require("./routes/userroutes");
const s3routes = require("./routes/s3routes");
const authroutes = require("./routes/authroutes");
const path = require("path");

const app = express();

dbconnection();

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.use('/api',userroutes);
app.use('/api',s3routes);
app.use('/api/auth',authroutes);

app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({
            "status_code": 400,
            "error_code": err.message || "Something went wrong",
        });
    }
    next();
});
app.use((req,res)=>{
    res.status(404).json({"status_code":404,"message":"routes not found"});
});

const port = process.env.PORT;
app.listen(port || 5000,()=>{
   console.log(`nodejs connected successfully : http://127.0.0.1:${port}`);
});
