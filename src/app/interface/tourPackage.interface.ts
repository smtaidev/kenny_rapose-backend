import { TourPackageStatus } from '../../../generated/prisma';

export type IDailyActivity = {
  title: string;
  description: string;
}[];

export type ITourPackage = {
  id: string;
  packageName: string;
  about: string;
  star: number;
  packagePriceAdult?: number;
  packagePriceChild?: number;
  packagePriceInfant?: number;
  pickUp?: string;
  dropOff?: string;
  packageCategory: string;
  ageRangeFrom: number;
  ageRangeTo: number;
  whatIncluded: string[];
  whatNotIncluded: string[];
  additionalInfo: string[];
  cancellationPolicy: string[];
  help: string;
  breezeCredit: number;
  
  // Legacy fields (keeping for backward compatibility)
  totalMembers?: number;
  startDay?: Date;
  endDay?: Date;
  tourType?: string;
  dailyActivity?: IDailyActivity;
  photos: string[];
  status: TourPackageStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type ICreateTourPackage = {
  packageName: string;
  about: string;
  star: number;
  packagePriceAdult?: number;
  packagePriceChild?: number;
  packagePriceInfant?: number;
  pickUp?: string;
  dropOff?: string;
  packageCategory: string;
  ageRangeFrom: number;
  ageRangeTo: number;
  whatIncluded: string[];
  whatNotIncluded: string[];
  additionalInfo: string[];
  cancellationPolicy: string[];
  help: string;
  breezeCredit: number;
  
  // Legacy fields (optional for backward compatibility)
  totalMembers?: number;
  startDay?: Date;
  endDay?: Date;
  tourType?: string;
  dailyActivity?: IDailyActivity;
  photos: string[];
  status?: TourPackageStatus;
};

export type IUpdateTourPackage = {
  packageName?: string;
  about?: string;
  star?: number;
  packagePriceAdult?: number;
  packagePriceChild?: number;
  packagePriceInfant?: number;
  packageCategory?: string;
  ageRangeFrom?: number;
  ageRangeTo?: number;
  whatIncluded?: string[];
  whatNotIncluded?: string[];
  additionalInfo?: string[];
  cancellationPolicy?: string[];
  help?: string;
  breezeCredit?: number;
  
  // Legacy fields (optional for backward compatibility)
  totalMembers?: number;
  startDay?: Date;
  endDay?: Date;
  tourType?: string;
  dailyActivity?: IDailyActivity;
  description?: string;
  photos?: string[];
  status?: TourPackageStatus;
};

export type ITourPackageResponse = {
  id: string;
  packageName: string;
  about: string;
  star: number;
  packagePriceAdult?: number;
  packagePriceChild?: number;
  packagePriceInfant?: number;
  pickUp?: string;
  dropOff?: string;
  packageCategory: string;
  ageRangeFrom: number;
  ageRangeTo: number;
  whatIncluded: string[];
  whatNotIncluded: string[];
  additionalInfo: string[];
  cancellationPolicy: string[];
  help: string;
  breezeCredit: number;
  
  // Legacy fields (keeping for backward compatibility)
  totalMembers?: number;
  pricePerPerson?: number;
  startDay?: Date;
  endDay?: Date;
  citiesVisited: string[];
  tourType?: string;
  activities: string[];
  dailyActivity?: IDailyActivity;
  photos: string[];
  status: TourPackageStatus;
  createdAt: Date;
  updatedAt: Date;
};
