const createError = require('http-errors')
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const S3 = new AWS.S3();

async function uploadToS3(file, bucketName) {
    const params = {
        Bucket: bucketName,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        const data = await S3.upload(params).promise();
        return data.Location;
    } catch (error) {
        if (error.code === 'CredetialsError') {
            throw createError (401, 'Invalid AWS credentials'); 
        } else if (error.code === 'NoSuchBucket') {
            throw createError (404, 'The specified bucket does not exist');
        } else {
            throw createError (405, `Error uploading file to S3: ${error.message}`)
        }
    }
}

module.exports = uploadToS3;

