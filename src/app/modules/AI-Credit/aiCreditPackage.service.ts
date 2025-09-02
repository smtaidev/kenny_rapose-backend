import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import {
  ICreateAiCreditPackage,
  IUpdateAiCreditPackage,
} from "../../interface/aiCreditPackage.interface";

//=====================Create AI Credit Package=====================
const createAiCreditPackage = async (packageData: ICreateAiCreditPackage) => {
  // Check if package with same name already exists
  const existingPackage = await prisma.aiCreditPackage.findFirst({
    where: {
      name: packageData.name,
      isDeleted: false,
    },
  });

  if (existingPackage) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Package with this name already exists"
    );
  }

  // Create new package
  const newPackage = await prisma.aiCreditPackage.create({
    data: packageData,
    select: {
      id: true,
      name: true,
      credits: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newPackage;
};

//=====================Update AI Credit Package=====================
const updateAiCreditPackage = async (
  id: string,
  updateData: IUpdateAiCreditPackage
) => {
  // Check if package exists
  const existingPackage = await prisma.aiCreditPackage.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingPackage) {
    throw new AppError(httpStatus.NOT_FOUND, "AI Credit Package not found");
  }

  // If name is being updated, check for duplicates
  if (updateData.name && updateData.name !== existingPackage.name) {
    const duplicatePackage = await prisma.aiCreditPackage.findFirst({
      where: {
        name: updateData.name,
        id: { not: id },
        isDeleted: false,
      },
    });

    if (duplicatePackage) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Package with this name already exists"
      );
    }
  }

  // Update package
  const updatedPackage = await prisma.aiCreditPackage.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      credits: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedPackage;
};

//=====================Delete AI Credit Package=====================
const deleteAiCreditPackage = async (id: string) => {
  // Check if package exists
  const existingPackage = await prisma.aiCreditPackage.findUnique({
    where: { id },
  });

  if (!existingPackage) {
    throw new AppError(httpStatus.NOT_FOUND, "AI Credit Package not found");
  }

  // Soft delete the package
  await prisma.aiCreditPackage.update({
    where: { id },
    data: {
      status: "INACTIVE",
      isDeleted: true,
    },
  });

  return { message: "AI Credit Package deleted successfully" };
};

//=====================Get AI Credit Package by ID=====================
const getAiCreditPackageById = async (id: string) => {
  const creditPackage = await prisma.aiCreditPackage.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      credits: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!creditPackage) {
    throw new AppError(httpStatus.NOT_FOUND, "AI Credit Package not found");
  }

  return creditPackage;
};

//=====================Get All AI Credit Packages=====================
const getAllAiCreditPackages = async () => {
  const packages = await prisma.aiCreditPackage.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      credits: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return packages;
};

export const AiCreditPackageService = {
  createAiCreditPackage,
  updateAiCreditPackage,
  deleteAiCreditPackage,
  getAiCreditPackageById,
  getAllAiCreditPackages,
};
