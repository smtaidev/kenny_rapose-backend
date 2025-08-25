import { AIPackageStatus } from '../../../generated/prisma';

export type IAiCreditPackage = {
  id: string;
  name: string;
  credits: number;
  price: number;
  status: AIPackageStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateAiCreditPackage = {
  name: string;
  credits: number;
  price: number;
  status?: AIPackageStatus;
};

export type IUpdateAiCreditPackage = {
  name?: string;
  credits?: number;
  price?: number;
  status?: AIPackageStatus;
};

export type IAiCreditPackageResponse = {
  id: string;
  name: string;
  credits: number;
  price: number;
  status: AIPackageStatus;
  createdAt: Date;
  updatedAt: Date;
};
