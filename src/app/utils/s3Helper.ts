import AWS from 'aws-sdk';
import config from '../../config';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

// Generate presigned URL for upload
export const generatePresignedUrl = async (
  fileName: string,
  fileType: string,
  purpose: 'profile-photo' | 'cover-photo' | 'tour-package'
): Promise<{ uploadUrl: string; fileKey: string }> => {
  try {
    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const fileKey = `${purpose}/${timestamp}-${randomString}.${fileExtension}`;

    // Generate presigned URL
    const uploadUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: config.aws.bucketName,
      Key: fileKey,
      ContentType: fileType,
      Expires: 300, // 5 minutes
      // ACL removed - bucket doesn't support ACLs
    });

    return {
      uploadUrl,
      fileKey,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate upload URL');
  }
};

// Delete single photo from S3
export const deletePhotoFromS3 = async (photoUrl: string): Promise<void> => {
  try {
    // Extract key from URL
    const key = photoUrl.split('.com/')[1];
    
    if (!key) {
      console.warn('Invalid photo URL format:', photoUrl);
      return;
    }

    await s3.deleteObject({
      Bucket: config.aws.bucketName,
      Key: key,
    }).promise();

    console.log(`Successfully deleted: ${key}`);
  } catch (error) {
    console.error('Failed to delete photo from S3:', error);
    // Don't throw error - deletion failure shouldn't break the main operation
  }
};

// Delete multiple photos from S3
export const deleteMultiplePhotosFromS3 = async (photoUrls: string[]): Promise<void> => {
  const deletePromises = photoUrls
    .filter(url => url && url.trim() !== '') // Filter out empty/null URLs
    .map(url => deletePhotoFromS3(url));
  
  await Promise.allSettled(deletePromises);
};

// Validate file type
export const validateFileType = (fileType: string): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  return allowedTypes.includes(fileType.toLowerCase());
};

// Get file size in MB
export const getFileSizeInMB = (fileSizeInBytes: number): number => {
  return fileSizeInBytes / (1024 * 1024);
};

// Validate file size (max 5MB)
export const validateFileSize = (fileSizeInBytes: number, maxSizeMB: number = 5): boolean => {
  const fileSizeMB = getFileSizeInMB(fileSizeInBytes);
  return fileSizeMB <= maxSizeMB;
};
