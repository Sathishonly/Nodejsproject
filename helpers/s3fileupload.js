const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3config");
const path = require("path");

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
        }
    }),
    limits: {
        fileSize: 50 * 1000 * 1000
    },
    fileFilter: (req, file, cb) => {
        allowtypes = /jpeg|png|jpg|gif|pdf|xls|xlsx/;
        var fileext = allowtypes.test(path.extname(file.originalname).toLowerCase());
        console.log(file.mimetype);
        var mimetype = allowtypes.test(file.mimetype);
       console.log(fileext,mimetype);
        if (fileext && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('only files are accepeted jpeg,jpg,pdf,gif,png'));
        }
    }
});

module.exports = upload;