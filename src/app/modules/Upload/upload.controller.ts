import { Request, Response } from 'express';
import { UploadService } from './upload.service';
import { IGeneratePresignedUrlRequest } from '../../interface/upload.interface';
import catchAsync from '../../utils/catchAsync';

// Generate presigned URL for photo upload
const generatePresignedUrl = catchAsync(async (req: Request, res: Response) => {
  const data: IGeneratePresignedUrlRequest = req.body;
  
  const result = await UploadService.generatePresignedUrlService(data);
  
  res.status(200).json({
    success: true,
    message: 'Presigned URL generated successfully',
    data: result,
  });
});

// Delete single photo
const deletePhoto = catchAsync(async (req: Request, res: Response) => {
  const { photoUrl } = req.body;
  
  const result = await UploadService.deletePhotoService(photoUrl);
  
  res.status(200).json({
    success: true,
    message: result.message,
  });
});

// Delete multiple photos
const deleteMultiplePhotos = catchAsync(async (req: Request, res: Response) => {
  const { photoUrls } = req.body;
  
  const result = await UploadService.deleteMultiplePhotosService(photoUrls);
  
  res.status(200).json({
    success: true,
    message: result.message,
    data: {
      deletedCount: result.deletedCount,
    },
  });
});

export const UploadController = {
  generatePresignedUrl,
  deletePhoto,
  deleteMultiplePhotos,
};
