const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
    }
});


maxsize = 50 * 1000 * 1000;
uploads = multer({
    storage: storage,
    limits: {
        fileSize: maxsize
    },
    fileFilter: (req, file, cb) => {
        allowtypes = /jpeg|png|gif|jpg|pdf|excel|xlsx/;
        fileext = allowtypes.test(path.extname(file.originalname).toLowerCase());
        mimetype = allowtypes.test(file.mimetype);
      
        if (fileext && mimetype) {
           return cb(null, true);
        } else {
            return cb(new Error(`Only image files (jpeg, jpg, png, gif) are allowed.`));
        }
    }
});

module.exports = uploads;