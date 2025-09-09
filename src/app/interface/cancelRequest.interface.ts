export interface ICreateCancelRequest {
  tourBookingId: string;
}

export interface IUpdateCancelRequestStatus {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ICancelRequestFilters {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  page?: number;
  limit?: number;
}
