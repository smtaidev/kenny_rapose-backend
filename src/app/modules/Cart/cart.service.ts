import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IAddToCartRequest, IAddToCartResponse, IGetCartResponse, IRemoveFromCartResponse } from "./cart.interface";

//=====================Add Tour Package to Cart=====================
const addToCart = async (userId: string, data: IAddToCartRequest): Promise<IAddToCartResponse> => {
  const { tourPackageId } = data;

  // Check if tour package exists and is active
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { 
      id: tourPackageId,
      status: 'ACTIVE'
    },
  });

  if (!tourPackage) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour package not found or not available");
  }

  // Check if already in cart
  const existingCartItem = await prisma.cart.findUnique({
    where: {
      userId_tourPackageId: {
        userId,
        tourPackageId,
      },
    },
  });

  if (existingCartItem) {
    throw new AppError(httpStatus.CONFLICT, "Tour package is already in your cart");
  }

  // Add to cart
  const cartItem = await prisma.cart.create({
    data: {
      userId,
      tourPackageId,
    },
    select: {
      id: true,
      tourPackageId: true,
      createdAt: true,
    },
  });

  return {
    message: "Tour package added to cart successfully",
    cartItem,
  };
};

//=====================Get User's Cart Items=====================
const getCartItems = async (userId: string): Promise<IGetCartResponse> => {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    select: {
      id: true,
      tourPackageId: true,
      createdAt: true,
      updatedAt: true,
      tourPackage: {
        select: {
          id: true,
          packageName: true,
          packageCategory: true,
          packagePriceAdult: true,
          packagePriceChild: true,
          packagePriceInfant: true,
          photos: true,
          star: true,
          citiesVisited: true,
          activities: true,
          highlights: true,
          description: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    cartItems,
    totalItems: cartItems.length,
  };
};

//=====================Remove Tour Package from Cart=====================
const removeFromCart = async (userId: string, cartItemId: string): Promise<IRemoveFromCartResponse> => {
  // Check if cart item exists and belongs to user
  const cartItem = await prisma.cart.findFirst({
    where: {
      id: cartItemId,
      userId: userId,
    },
  });

  if (!cartItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart item not found or doesn't belong to you");
  }

  // Remove from cart
  await prisma.cart.delete({
    where: {
      id: cartItemId,
    },
  });

  return {
    message: "Tour package removed from cart successfully",
    removedItemId: cartItem.id,
  };
};

//=====================Clear Entire Cart=====================
const clearCart = async (userId: string): Promise<{ message: string; removedCount: number }> => {
  const result = await prisma.cart.deleteMany({
    where: { userId },
  });

  return {
    message: "Cart cleared successfully",
    removedCount: result.count,
  };
};

export const CartService = {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
};
