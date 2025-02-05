// src/Utils/s3Utils.js

import axios from 'axios';

 const uploadFileToS3 = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/upload-to-s3', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.fileUrl;
    } else {
      throw new Error('Failed to upload file');
    }
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

export default uploadFileToS3
