import AWS from 'aws-sdk';
import config from '../../config';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

// Upload file buffer to S3
export const uploadFileToS3 = async (
  file: Express.Multer.File,
  purpose: 'profile-photo' | 'cover-photo' | 'tour-package'
): Promise<string> => {
  try {
    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `${purpose}/${timestamp}-${randomString}.${fileExtension}`;

    // Upload parameters
    const uploadParams = {
      Bucket: config.aws.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload to S3
    const result = await s3.upload(uploadParams).promise();
    
    return result.Location; // Return the S3 URL
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

// Delete file from S3
export const deleteFileFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    // Extract key from URL
    const key = fileUrl.split('.com/')[1];
    
    if (!key) {
      console.warn('Invalid file URL format:', fileUrl);
      return;
    }

    await s3.deleteObject({
      Bucket: config.aws.bucketName,
      Key: key,
    }).promise();

    console.log(`Successfully deleted: ${key}`);
  } catch (error) {
    console.error('Failed to delete file from S3:', error);
    // Don't throw error - deletion failure shouldn't break the main operation
  }
};
