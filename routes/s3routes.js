const express = require("express");
const router = express.Router();
const s3fileupload = require("../helpers/s3fileupload");
const s3Controller = require("../controller/s3filecontroller");

//s3
router.post('/uploadfiles3', s3fileupload.array('images',10), s3Controller.uploadfiles3);

// // Route to get file
router.get('/file/:filename', s3Controller.getfile);

// // Route to delete file
router.delete('/deletes3file/:filename', s3Controller.deletes3file);


module.exports = router;