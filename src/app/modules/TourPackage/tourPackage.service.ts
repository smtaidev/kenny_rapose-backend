import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICreateTourPackage, IUpdateTourPackage } from '../../interface/tourPackage.interface';

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
      pricePerPerson: true,
      startDay: true,
      endDay: true,
      citiesVisited: true,
      tourType: true,
      activities: true,
      dailyActivity: true,
      highlights: true,
      description: true,
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
      pricePerPerson: true,
      startDay: true,
      endDay: true,
      citiesVisited: true,
      tourType: true,
      activities: true,
      dailyActivity: true,
      highlights: true,
      description: true,
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
      pricePerPerson: true,
      startDay: true,
      endDay: true,
      citiesVisited: true,
      tourType: true,
      activities: true,
      dailyActivity: true,
      highlights: true,
      description: true,
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
      pricePerPerson: true,
      startDay: true,
      endDay: true,
      citiesVisited: true,
      tourType: true,
      activities: true,
      dailyActivity: true,
      highlights: true,
      description: true,
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

export const TourPackageService = {
  createTourPackage,
  updateTourPackage,
  deleteTourPackage,
  getTourPackageById,
  getAllTourPackages,
};
