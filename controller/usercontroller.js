const usermodule = require("../module/usermodel");
const path = require("path");
const fs = require("fs");
const url = require('url');

exports.getuserslist = async (req, res) => {
    try {
        const userlist = await usermodule.find();
        res.status(200).json({ "status_code": 200, "data": userlist });
    } catch (error) {
        res.status(400).json({ "error_code": 400, "message": error.message });
    }
}

exports.adduser = async (req, res) => {
    try {
        const { name, email, phonenumber, address } = req.body;
        let person = new usermodule({
            name,
            email,
            phonenumber,
            address
        });
        await person.save();

        res.status(200).json({ "status_code": 200, "message": "user added succesfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);  // Collect validation error messages
            return res.status(400).json({
                "error_code": 400,
                "message": messages.join(', ')  // Combine all validation errors into a single string
            });
        }

        // Handle any other errors
        return res.status(400).json({ "error_code": 400, "message": error.message });
    }
}


exports.getuser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ "error_code": 400, "message": "id is required" });
        }
        userDetail = await usermodule.findById(id);
        if (!userDetail) {
            return res.status(404).json({ "status_code": 404, "message": "User not found" });
        }
        res.status(200).json({ "status_code": 200, "data": userDetail });
    } catch (error) {
        res.status(400).json({ "error_code": 400, "message": error.message });
    }
}

exports.updateuser = async (req, res) => {
    try {
        const id = req.params.id;
        const updateitems = req.body;
        if (!id) {
            return res.status(400).json({ "error_code": 400, "message": "id is required" });
        }
        userDetail = await usermodule.findByIdAndUpdate(id, updateitems, { new: true });
        if (!userDetail) {
            return res.status(404).json({ "status_code": 404, "message": "User not found" });
        }
        res.status(200).json({ "status_code": 200, "data": userDetail, "message": "user details updated successfully" });
    } catch (error) {
        res.status(400).json({ "error_code": 400, "message": error.message });
    }
}

exports.deleteuser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ "error_code": 400, "message": "id is required" });
        }
        userDetail = await usermodule.findByIdAndDelete(id);
        if (!userDetail) {
            return res.status(404).json({ "status_code": 404, "message": "User not found" });
        }
        res.status(200).json({ "status_code": 200, "message": "user details updated successfully" });
    } catch (error) {
        res.status(400).json({ "error_code": 400, "message": error.message });
    }
}



//fileupload

exports.fileupload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ "error_code": 400, "message": "No files were uploaded" });
        }

        return res.status(200).json({ "status_code": 200, "message": "Files uploaded successfully" });

    } catch (error) {
        res.status(500).json({ "error_code": 500, "message": error.message });
    }
};


exports.getFile = async (req, res) => {
    const filename = req.params.filename;
    if (!filename) {
        return res.status(400).json({
            status_code: 400,
            message: "Filename parameter is missing"
        });
    }
    // Define the file path (assuming 'uploads' is inside 'public')
    const filePath = path.join(__dirname, "..", "public","uploads", filename);
console.log(filePath);
    // Base URL for the public-facing server
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`; // Correct URL generation

    // Check if the file exists at the specified path
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If file does not exist, respond with 404
            return res.status(404).json({
                status_code: 404,
                message: "File not found"
            });
        } else {
            // File exists, send the public-facing URL in the response
            const fileUrl = `${baseUrl}/${filename}`; // Construct the correct file URL

            return res.status(200).json({
                status_code: 200,
                message: "File found",
                file_url: fileUrl
            });
        }
    });
};


// Route handler to delete a file
exports.deleteFile = (req, res) => {
    // Get the filename from the request parameters
    const filename = req.params.filename;

    // Construct the file path where the file is located
    const filepath = path.join(__dirname, "..", "public","uploads", filename);
    console.log(filepath);

    // Check if the file exists before attempting to delete it
    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, send a 404 response
            return res.status(404).json({
                status_code: 404,
                message: "File not found"
            });
        } else {
            // If the file exists, proceed to delete it
            fs.unlink(filepath, (err) => {
                if (err) {
                    // If there's an error while deleting, send a 500 response
                    return res.status(500).json({
                        status_code: 500,
                        message: "Error deleting file"
                    });
                }

                // Successfully deleted the file, send a success response
                return res.status(200).json({
                    status_code: 200,
                    message: "File deleted successfully"
                });
            });
        }
    });
};

