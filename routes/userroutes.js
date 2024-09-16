const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/usercontroller");
const fileupload = require("../helpers/fileupload");
const auth = require("../middleware/auth");

router.get("/getuserslist",auth, usercontroller.getuserslist);
router.post("/adduser",usercontroller.adduser);
router.get("/getuser/:id",usercontroller.getuser);
router.put("/updateuser/:id",usercontroller.updateuser);
router.delete("/deleteuser/:id",usercontroller.deleteuser);


//file uploads
router.post("/multifileupload", fileupload.array("images",500),usercontroller.fileupload);
router.get("/getfile/:filename", usercontroller.getFile);
router.delete("/deleteFile/:filename", usercontroller.deleteFile);


module.exports = router;