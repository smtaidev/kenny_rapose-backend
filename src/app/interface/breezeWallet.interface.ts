export interface ICreateBreezeWalletPackage {
  name: string;
  amount: number;
  price: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IUpdateBreezeWalletPackage {
  name?: string;
  amount?: number;
  price?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IBreezeWalletPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBreezeWallet {
  id: string;
  travelerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  breezeWalletBalance: number;
}

export interface ITopUpRequest {
  packageId: string;
  userId: string;
}
