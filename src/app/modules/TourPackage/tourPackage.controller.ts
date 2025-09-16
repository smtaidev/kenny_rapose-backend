import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TourPackageService } from './tourPackage.service';
import httpStatus from 'http-status';

//=====================Create Tour Package=====================
const createTourPackage = catchAsync(async (req: Request, res: Response) => {
  // Check if files are uploaded (multipart/form-data)
  const files = req.files as Express.Multer.File[];
  
  if (files && files.length > 0) {
    // Create with photos
    const result = await TourPackageService.createTourPackageWithPhotos(req.body, files);
    
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Tour package created successfully with photos',
      data: result,
    });
  } else {
    // Create without photos (JSON only)
    const result = await TourPackageService.createTourPackage(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Tour package created successfully',
      data: result,
    });
  }
});

//=====================Update Tour Package=====================
const updateTourPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  
  if (files && files.length > 0) {
    // Update with photos
    const result = await TourPackageService.updateTourPackageWithPhotos(id, req.body, files);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour package updated successfully with photos',
      data: result,
    });
  } else {
    // Update without photos (JSON only)
    const result = await TourPackageService.updateTourPackage(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour package updated successfully',
      data: result,
    });
  }
});

//=====================Delete Tour Package (Soft Delete)=====================
const deleteTourPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourPackageService.deleteTourPackage(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour package deleted successfully',
    data: result,
  });
});

//=====================Get Tour Package by ID=====================
const getTourPackageById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourPackageService.getTourPackageById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour package retrieved successfully',
    data: result,
  });
});

//=====================Get All Tour Packages=====================
const getAllTourPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await TourPackageService.getAllTourPackages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour packages retrieved successfully',
    data: result,
  });
});

//=====================Upload Photos to Tour Package=====================
const uploadPhotos = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No photos provided',
    });
  }

  const result = await TourPackageService.uploadTourPackagePhotos(id, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Photos uploaded successfully',
    data: { uploadedUrls: result },
  });
});

//=====================Replace All Photos=====================
const replacePhotos = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No photos provided',
    });
  }

  const result = await TourPackageService.replaceTourPackagePhotos(id, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Photos replaced successfully',
    data: { uploadedUrls: result },
  });
});

//=====================Delete Photos=====================
const deletePhotos = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { photoUrls } = req.body;
  
  if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No photo URLs provided',
    });
  }

  await TourPackageService.deleteTourPackagePhotos(id, photoUrls);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Photos deleted successfully',
  });
});

export const TourPackageController = {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getTourPackageById,
  getAllTourPackages,
  uploadPhotos,
  replacePhotos,
  deletePhotos,
};
