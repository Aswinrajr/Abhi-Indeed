import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadFileToS3 = (file) => {  
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `resumes/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise().then(data => data.Location);
};

export default uploadFileToS3;
