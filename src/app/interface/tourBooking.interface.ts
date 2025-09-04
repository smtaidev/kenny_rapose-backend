// import { BookingStatus } from '../../../generated/prisma';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';

export interface ICreateTourBooking {
  tourPackageId: string;
  adults: number;
  children: number;
  infants: number;
  travelDate?: Date;
}

export interface IUpdateTourBooking {
  adults?: number;
  children?: number;
  infants?: number;
  travelDate?: Date;
  status?: BookingStatus;
}

export interface ITourBookingResponse {
  id: string;
  userId: string;
  tourPackageId: string;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  status: BookingStatus;
  bookingDate: Date;
  travelDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tourPackage: {
    id: string;
    packageName: string;
    packageCategory: string;
    packagePriceAdult: number;
    packagePriceChild: number;
    packagePriceInfant: number;
  };
}
