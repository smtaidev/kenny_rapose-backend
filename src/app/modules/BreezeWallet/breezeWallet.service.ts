import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICreateBreezeWalletPackage, IUpdateBreezeWalletPackage } from '../../interface/breezeWallet.interface';

//=====================Create Breeze Wallet Package=====================
const createBreezeWalletPackage = async (packageData: ICreateBreezeWalletPackage) => {
  // Check if package with same name already exists
  const existingPackage = await prisma.breezeWalletPackage.findFirst({
    where: {
      name: packageData.name,
    },
  });

  if (existingPackage) {
    throw new AppError(httpStatus.CONFLICT, 'Package with this name already exists');
  }

  // Create new package
  const newPackage = await prisma.breezeWalletPackage.create({
    data: packageData,
    select: {
      id: true,
      name: true,
      amount: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newPackage;
};

//=====================Update Breeze Wallet Package=====================
const updateBreezeWalletPackage = async (id: string, updateData: IUpdateBreezeWalletPackage) => {
  // Check if package exists
  const existingPackage = await prisma.breezeWalletPackage.findUnique({
    where: { id },
  });

  if (!existingPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Breeze Wallet Package not found');
  }

  // If name is being updated, check for duplicates
  if (updateData.name && updateData.name !== existingPackage.name) {
    const duplicatePackage = await prisma.breezeWalletPackage.findFirst({
      where: {
        name: updateData.name,
        id: { not: id },
      },
    });

    if (duplicatePackage) {
      throw new AppError(httpStatus.CONFLICT, 'Package with this name already exists');
    }
  }

  // Update package
  const updatedPackage = await prisma.breezeWalletPackage.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      amount: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedPackage;
};

//=====================Delete Breeze Wallet Package=====================
const deleteBreezeWalletPackage = async (id: string) => {
  // Check if package exists
  const existingPackage = await prisma.breezeWalletPackage.findUnique({
    where: { id },
  });

  if (!existingPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Breeze Wallet Package not found');
  }

  // Permanently delete the package
  await prisma.breezeWalletPackage.delete({
    where: { id },
  });

  return { message: 'Breeze Wallet Package deleted successfully' };
};

//=====================Get Breeze Wallet Package by ID=====================
const getBreezeWalletPackageById = async (id: string) => {
  const creditPackage = await prisma.breezeWalletPackage.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      amount: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!creditPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Breeze Wallet Package not found');
  }

  return creditPackage;
};

//=====================Get All Breeze Wallet Packages=====================
const getAllBreezeWalletPackages = async () => {
  const packages = await prisma.breezeWalletPackage.findMany({
    select: {
      id: true,
      name: true,
      amount: true,
      price: true,
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

//=====================Get User's Breeze Wallet Balance=====================
const getWalletBalance = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      travelerNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      breezeWalletBalance: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

export const BreezeWalletService = {
  createBreezeWalletPackage,
  updateBreezeWalletPackage,
  deleteBreezeWalletPackage,
  getBreezeWalletPackageById,
  getAllBreezeWalletPackages,
  getWalletBalance,
};
