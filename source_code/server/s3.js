require('dotenv').config();

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.S3_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.S3_BUCKET_SECRET_KEY;

const S3 = require('aws-sdk/clients/s3');
const multer  = require('multer');
const multers3 = require('multer-s3');


const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  })
  
  // uploads a file to s3
  function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename
    }
  
    return s3.upload(uploadParams).promise()
  }
  exports.uploadFile = uploadFile