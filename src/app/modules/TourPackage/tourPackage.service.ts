import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICreateTourPackage, IUpdateTourPackage } from '../../interface/tourPackage.interface';
import { uploadFileToS3, deleteFileFromS3 } from '../../utils/s3Upload';
import { Express } from 'express';

//=====================Create Tour Package=====================
const createTourPackage = async (packageData: ICreateTourPackage) => {
  // Check if package with same name already exists
  const existingPackage = await prisma.tourPackage.findFirst({
    where: {
      packageName: packageData.packageName,
      deletedAt: null,
    },
  });

  if (existingPackage) {
    throw new AppError(httpStatus.CONFLICT, 'Tour package with this name already exists');
  }

  // Create new package
  const newPackage = await prisma.tourPackage.create({
    data: {
      ...packageData,
      // Handle optional legacy date fields
      ...(packageData.startDay && { startDay: new Date(packageData.startDay) }),
      ...(packageData.endDay && { endDay: new Date(packageData.endDay) }),
    },
    select: {
      id: true,
      packageName: true,
      about: true,
      star: true,
      packagePriceAdult: true,
      packagePriceChild: true,
      packagePriceInfant: true,
      pickUp: true,
      dropOff: true,
      packageCategory: true,
      ageRangeFrom: true,
      ageRangeTo: true,
      whatIncluded: true,
      whatNotIncluded: true,
      additionalInfo: true,
      cancellationPolicy: true,
      help: true,
      breezeCredit: true,
      // Legacy fields
      totalMembers: true,
      startDay: true,
      endDay: true,
      tourType: true,
      dailyActivity: true,
      photos: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newPackage;
};

//=====================Update Tour Package=====================
const updateTourPackage = async (id: string, updateData: IUpdateTourPackage) => {
  // Check if package exists and is not deleted
  const existingPackage = await prisma.tourPackage.findFirst({
    where: { 
      id,
      deletedAt: null,
    },
  });

  if (!existingPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
  }

  // If name is being updated, check for duplicates
  if (updateData.packageName && updateData.packageName !== existingPackage.packageName) {
    const duplicatePackage = await prisma.tourPackage.findFirst({
      where: {
        packageName: updateData.packageName,
        id: { not: id },
        deletedAt: null,
      },
    });

    if (duplicatePackage) {
      throw new AppError(httpStatus.CONFLICT, 'Tour package with this name already exists');
    }
  }

  // Prepare update data
  const dataToUpdate: any = { ...updateData };
  if (updateData.startDay) {
    dataToUpdate.startDay = new Date(updateData.startDay);
  }
  if (updateData.endDay) {
    dataToUpdate.endDay = new Date(updateData.endDay);
  }

  // Update package
  const updatedPackage = await prisma.tourPackage.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      packageName: true,
      about: true,
      star: true,
      packagePriceAdult: true,
      packagePriceChild: true,
      packagePriceInfant: true,
      pickUp: true,
      dropOff: true,
      packageCategory: true,
      ageRangeFrom: true,
      ageRangeTo: true,
      whatIncluded: true,
      whatNotIncluded: true,
      additionalInfo: true,
      cancellationPolicy: true,
      help: true,
      breezeCredit: true,
      // Legacy fields
      totalMembers: true,
      startDay: true,
      endDay: true,
      tourType: true,
      dailyActivity: true,
      photos: true,
      status: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedPackage;
};

//=====================Delete Tour Package (Soft Delete)=====================
const deleteTourPackage = async (id: string) => {
  // Check if package exists and is not already deleted
  const existingPackage = await prisma.tourPackage.findFirst({
    where: { 
      id,
      deletedAt: null,
    },
  });

  if (!existingPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
  }

  // Soft delete the package
  await prisma.tourPackage.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  return { message: 'Tour package deleted successfully' };
};

//=====================Get Tour Package by ID=====================
const getTourPackageById = async (id: string) => {
  const tourPackage = await prisma.tourPackage.findFirst({
    where: { 
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      packageName: true,
      about: true,
      star: true,
      packagePriceAdult: true,
      packagePriceChild: true,
      packagePriceInfant: true,
      pickUp: true,
      dropOff: true,
      packageCategory: true,
      ageRangeFrom: true,
      ageRangeTo: true,
      whatIncluded: true,
      whatNotIncluded: true,
      additionalInfo: true,
      cancellationPolicy: true,
      help: true,
      breezeCredit: true,
      // Legacy fields
      totalMembers: true,
      startDay: true,
      endDay: true,
      tourType: true,
      dailyActivity: true,
      photos: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!tourPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
  }

  return tourPackage;
};

//=====================Get All Tour Packages=====================
const getAllTourPackages = async () => {
  const packages = await prisma.tourPackage.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      packageName: true,
      about: true,
      star: true,
      packagePriceAdult: true,
      packagePriceChild: true,
      packagePriceInfant: true,
      pickUp: true,
      dropOff: true,
      packageCategory: true,
      ageRangeFrom: true,
      ageRangeTo: true,
      whatIncluded: true,
      whatNotIncluded: true,
      additionalInfo: true,
      cancellationPolicy: true,
      help: true,
      breezeCredit: true,
      // Legacy fields
      totalMembers: true,
      startDay: true,
      endDay: true,
      tourType: true,
      dailyActivity: true,
      photos: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return packages;
};

//=====================Photo Management Functions=====================

// Upload multiple photos for tour package
const uploadTourPackagePhotos = async (
  tourPackageId: string,
  files: Express.Multer.File[]
): Promise<string[]> => {
  try {
    // Verify tour package exists
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: tourPackageId },
      select: { id: true, packageName: true, photos: true }
    });

    if (!tourPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
    }

    console.log(`🔧 Uploading ${files.length} photos for tour package: ${tourPackage.packageName}`);

    // Upload all files to S3
    const uploadPromises = files.map(file => 
      uploadFileToS3(file, 'tour-package')
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    console.log(`✅ Successfully uploaded ${uploadedUrls.length} photos to S3`);

    // Update tour package with new photos
    const updatedPackage = await prisma.tourPackage.update({
      where: { id: tourPackageId },
      data: {
        photos: [...tourPackage.photos, ...uploadedUrls]
      },
      select: {
        id: true,
        packageName: true,
        photos: true
      }
    });

    console.log(`✅ Tour package photos updated. Total photos: ${updatedPackage.photos.length}`);

    return uploadedUrls;
  } catch (error: any) {
    console.error('❌ Tour package photo upload error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to upload tour package photos. Please try again.'
    );
  }
};

// Replace all photos for tour package
const replaceTourPackagePhotos = async (
  tourPackageId: string,
  files: Express.Multer.File[]
): Promise<string[]> => {
  try {
    // Verify tour package exists
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: tourPackageId },
      select: { id: true, packageName: true, photos: true }
    });

    if (!tourPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
    }

    console.log(`🔧 Replacing photos for tour package: ${tourPackage.packageName}`);
    console.log(`🔧 Old photos count: ${tourPackage.photos.length}, New files count: ${files.length}`);

    // Delete old photos from S3
    if (tourPackage.photos.length > 0) {
      console.log('🗑️ Deleting old photos from S3...');
      const deletePromises = tourPackage.photos.map(photoUrl => 
        deleteFileFromS3(photoUrl)
      );
      await Promise.all(deletePromises);
      console.log('✅ Old photos deleted from S3');
    }

    // Upload new files to S3
    const uploadPromises = files.map(file => 
      uploadFileToS3(file, 'tour-package')
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    console.log(`✅ Successfully uploaded ${uploadedUrls.length} new photos to S3`);

    // Update tour package with new photos
    const updatedPackage = await prisma.tourPackage.update({
      where: { id: tourPackageId },
      data: {
        photos: uploadedUrls
      },
      select: {
        id: true,
        packageName: true,
        photos: true
      }
    });

    console.log(`✅ Tour package photos replaced. New photos count: ${updatedPackage.photos.length}`);

    return uploadedUrls;
  } catch (error: any) {
    console.error('❌ Tour package photo replacement error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to replace tour package photos. Please try again.'
    );
  }
};

// Delete specific photos from tour package
const deleteTourPackagePhotos = async (
  tourPackageId: string,
  photoUrls: string[]
): Promise<void> => {
  try {
    // Verify tour package exists
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: tourPackageId },
      select: { id: true, packageName: true, photos: true }
    });

    if (!tourPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
    }

    console.log(`🔧 Deleting ${photoUrls.length} photos from tour package: ${tourPackage.packageName}`);

    // Delete photos from S3
    const deletePromises = photoUrls.map(photoUrl => 
      deleteFileFromS3(photoUrl)
    );
    await Promise.all(deletePromises);

    // Remove photos from database
    const remainingPhotos = tourPackage.photos.filter(photo => 
      !photoUrls.includes(photo)
    );

    await prisma.tourPackage.update({
      where: { id: tourPackageId },
      data: {
        photos: remainingPhotos
      }
    });

    console.log(`✅ Successfully deleted ${photoUrls.length} photos. Remaining photos: ${remainingPhotos.length}`);
  } catch (error: any) {
    console.error('❌ Tour package photo deletion error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete tour package photos. Please try again.'
    );
  }
};

// Create tour package with photos
const createTourPackageWithPhotos = async (
  packageData: any,
  files: Express.Multer.File[]
): Promise<any> => {
  try {
    console.log(`🔧 Creating tour package with ${files.length} photos`);

    // Upload photos first
    const uploadPromises = files.map(file => 
      uploadFileToS3(file, 'tour-package')
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    // Create tour package with photo URLs
    const newPackage = await prisma.tourPackage.create({
      data: {
        ...packageData,
        photos: uploadedUrls,
        // Handle optional legacy date fields
        ...(packageData.startDay && { startDay: new Date(packageData.startDay) }),
        ...(packageData.endDay && { endDay: new Date(packageData.endDay) }),
      },
      select: {
        id: true,
        packageName: true,
        about: true,
        star: true,
        packagePriceAdult: true,
        packagePriceChild: true,
        packagePriceInfant: true,
        pickUp: true,
        dropOff: true,
        packageCategory: true,
        ageRangeFrom: true,
        ageRangeTo: true,
        whatIncluded: true,
        whatNotIncluded: true,
        additionalInfo: true,
        cancellationPolicy: true,
        help: true,
        breezeCredit: true,
        // Legacy fields
        totalMembers: true,
        startDay: true,
        endDay: true,
        tourType: true,
        dailyActivity: true,
        photos: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(`✅ Tour package created successfully with ${uploadedUrls.length} photos`);

    return newPackage;
  } catch (error: any) {
    console.error('❌ Tour package creation with photos error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create tour package with photos. Please try again.'
    );
  }
};

// Update tour package with photos
const updateTourPackageWithPhotos = async (
  id: string,
  updateData: any,
  files: Express.Multer.File[]
): Promise<any> => {
  try {
    console.log(`🔧 Updating tour package with ${files.length} new photos`);

    // Get current tour package
    const currentPackage = await prisma.tourPackage.findUnique({
      where: { id },
      select: { id: true, packageName: true, photos: true }
    });

    if (!currentPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
    }

    // Upload new photos
    const uploadPromises = files.map(file => 
      uploadFileToS3(file, 'tour-package')
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    // Update tour package with new photos added to existing ones
    const updatedPackage = await prisma.tourPackage.update({
      where: { id },
      data: {
        ...updateData,
        photos: [...currentPackage.photos, ...uploadedUrls],
        // Handle optional legacy date fields
        ...(updateData.startDay && { startDay: new Date(updateData.startDay) }),
        ...(updateData.endDay && { endDay: new Date(updateData.endDay) }),
      },
      select: {
        id: true,
        packageName: true,
        about: true,
        star: true,
        packagePriceAdult: true,
        packagePriceChild: true,
        packagePriceInfant: true,
        pickUp: true,
        dropOff: true,
        packageCategory: true,
        ageRangeFrom: true,
        ageRangeTo: true,
        whatIncluded: true,
        whatNotIncluded: true,
        additionalInfo: true,
        cancellationPolicy: true,
        help: true,
        breezeCredit: true,
        // Legacy fields
        totalMembers: true,
        startDay: true,
        endDay: true,
        tourType: true,
        dailyActivity: true,
        photos: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(`✅ Tour package updated successfully. Total photos: ${updatedPackage.photos.length}`);

    return updatedPackage;
  } catch (error: any) {
    console.error('❌ Tour package update with photos error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update tour package with photos. Please try again.'
    );
  }
};

export const TourPackageService = {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getTourPackageById,
  getAllTourPackages,
  // Photo management functions
  uploadTourPackagePhotos,
  replaceTourPackagePhotos,
  deleteTourPackagePhotos,
  createTourPackageWithPhotos,
  updateTourPackageWithPhotos,
};
