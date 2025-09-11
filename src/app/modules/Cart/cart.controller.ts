import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CartService } from './cart.service';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import AppError from '../../errors/AppError';

//=====================Add Tour Package to Cart=====================
const addToCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { tourPackageId } = req.params;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await CartService.addToCart(userId, { tourPackageId });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Tour package added to cart successfully',
    data: result,
  });
});

//=====================Get User's Cart Items=====================
const getCartItems = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await CartService.getCartItems(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart items retrieved successfully',
    data: result,
  });
});

//=====================Remove Tour Package from Cart=====================
const removeFromCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { cartItemId } = req.params;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await CartService.removeFromCart(userId, cartItemId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour package removed from cart successfully',
    data: result,
  });
});

//=====================Clear Entire Cart=====================
const clearCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await CartService.clearCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart cleared successfully',
    data: result,
  });
});

export const CartController = {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
};
