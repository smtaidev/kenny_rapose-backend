export interface IAddToCartRequest {
  tourPackageId: string;
}

export interface IAddToCartResponse {
  message: string;
  cartItem: {
    id: string;
    tourPackageId: string;
    createdAt: Date;
  };
}

export interface ICartItem {
  id: string;
  tourPackageId: string;
  createdAt: Date;
  updatedAt: Date;
  tourPackage: {
    id: string;
    packageName: string;
    packageCategory: string;
    packagePriceAdult: number | null;
    packagePriceChild: number | null;
    packagePriceInfant: number | null;
    pickUp: string | null;
    dropOff: string | null;
    photos: string[];
    star: number;
  };
}

export interface IGetCartResponse {
  cartItems: ICartItem[];
  totalItems: number;
}

export interface IRemoveFromCartResponse {
  message: string;
  removedItemId: string;
}
