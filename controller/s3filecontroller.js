const { GetObjectCommand, DeleteObjectCommand,HeadObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3config");
const path = require("path");

exports.uploadfiles3 = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ "status_code": 400, "message": "No files were uploaded" });
        }
        return res.status(200).json({ "status_code": 400, "message": "Files uploaded successfully" });
    } catch (error) {
        return res.status(500).json({ "status_code": 500, "message": error.message });
    }
}


const getFileHeaders = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.gif':
            return { ContentType: `image/${ext === '.jpg' ? 'jpeg' : ext.slice(1)}`, ContentDisposition: 'inline' };
        case '.pdf':
            return { ContentType: 'application/pdf', ContentDisposition: 'inline' };
        case '.xlsx':
        case '.xls':
            return { ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ContentDisposition: 'attachment' };
        default:
            return { ContentType: 'application/octet-stream', ContentDisposition: 'attachment' };
    }
};



exports.getfile = async (req, res) => {
    try {
        const filename = req.params.filename;
        console.log(filename);
        const { ContentType, ContentDisposition } = getFileHeaders(filename);

        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // Ensure this is set in your environment variables
            Key: filename,
            ResponseContentType: ContentType, // Set correct Content-Type
            ResponseContentDisposition: ContentDisposition // Set Content-Disposition
        };

        try {
            await s3.send(new HeadObjectCommand(params));
        } catch (headErr) {
            // If the HeadObjectCommand throws an error, the file does not exist
            if (headErr.$metadata.httpStatusCode === 404) {
                return res.status(404).json({
                    status_code: 404,
                    message: "File not found"
                });
            }
            // For other errors, forward the error response
            throw headErr;
        }

        const comment = new GetObjectCommand(params);

        const url = await getSignedUrl(s3, comment, { expiresIn: 5000 });

        res.status(200).json({ "status_code": 200, "data": url });
    } catch (error) {
        res.status(400).json({ "status_code": 400, "message": error });
    }
};


exports.deletes3file = async (req,res)=>{
    try {
        const file = req.params.filename;

        const params = {
            Bucket : process.env.S3_BUCKET_NAME,
            Key : file
        }

        try {
            await s3.send(new HeadObjectCommand(params));
        } catch (headErr) {
            // If the HeadObjectCommand throws an error, the file does not exist
            if (headErr.$metadata.httpStatusCode === 404) {
                return res.status(404).json({
                    status_code: 404,
                    message: "File not found"
                });
            }
            // For other errors, forward the error response
            throw headErr;
        }

      const command =  new DeleteObjectCommand(params);

      await s3.send(command);


        res.status(200).json({
            "status_code": 200,
            "message" : "deleted successfully"
        })
    } catch (error) {
        res.status(400).json({ "status_code": 400, "message": error });
    }
}