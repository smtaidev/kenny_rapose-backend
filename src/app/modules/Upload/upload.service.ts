import { 
  generatePresignedUrl, 
  deletePhotoFromS3, 
  deleteMultiplePhotosFromS3,
  validateFileType,
  validateFileSize
} from '../../utils/s3Helper';
import { IGeneratePresignedUrlRequest, IGeneratePresignedUrlResponse } from '../../interface/upload.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Generate presigned URL for photo upload
const generatePresignedUrlService = async (data: IGeneratePresignedUrlRequest): Promise<IGeneratePresignedUrlResponse> => {
  const { fileName, fileType, purpose, fileSize } = data;

  // Validate file type
  if (!validateFileType(fileType)) {
    throw new AppError(
      httpStatus.BAD_REQUEST, 
      'Invalid file type. Only JPEG, JPG, PNG, WebP, and GIF files are allowed.'
    );
  }

  // Validate file size if provided
  if (fileSize && !validateFileSize(fileSize)) {
    throw new AppError(
      httpStatus.BAD_REQUEST, 
      'File size too large. Maximum allowed size is 5MB.'
    );
  }

  try {
    const result = await generatePresignedUrl(fileName, fileType, purpose);
    
    return {
      uploadUrl: result.uploadUrl,
      fileKey: result.fileKey,
      expiresIn: 300 // 5 minutes
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to generate upload URL. Please try again.'
    );
  }
};

// Delete single photo from S3
const deletePhotoService = async (photoUrl: string): Promise<{ message: string }> => {
  if (!photoUrl || photoUrl.trim() === '') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Photo URL is required');
  }

  try {
    await deletePhotoFromS3(photoUrl);
    return { message: 'Photo deleted successfully' };
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete photo. Please try again.'
    );
  }
};

// Delete multiple photos from S3
const deleteMultiplePhotosService = async (photoUrls: string[]): Promise<{ message: string; deletedCount: number }> => {
  if (!photoUrls || photoUrls.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Photo URLs are required');
  }

  // Filter out empty/null URLs
  const validUrls = photoUrls.filter(url => url && url.trim() !== '');
  
  if (validUrls.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No valid photo URLs provided');
  }

  try {
    await deleteMultiplePhotosFromS3(validUrls);
    return { 
      message: 'Photos deleted successfully',
      deletedCount: validUrls.length
    };
  } catch (error) {
    console.error('Error deleting photos:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete photos. Please try again.'
    );
  }
};

export const UploadService = {
  generatePresignedUrlService,
  deletePhotoService,
  deleteMultiplePhotosService,
};
