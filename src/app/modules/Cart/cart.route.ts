import express from 'express';
import { CartController } from './cart.controller';
import validateRequest from '../../middlewares/validateRequest';
import { addToCartZodSchema, removeFromCartZodSchema } from './cart.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

//=====================Add Tour Package to Cart (Authenticated User)=====================
router.post(
  '/add/:tourPackageId',
  auth,
  validateRequest(addToCartZodSchema),
  CartController.addToCart
);

//=====================Get User's Cart Items (Authenticated User)=====================
router.get(
  '/',
  auth,
  CartController.getCartItems
);

//=====================Remove Tour Package from Cart (Authenticated User)=====================
router.delete(
  '/:cartItemId',
  auth,
  validateRequest(removeFromCartZodSchema),
  CartController.removeFromCart
);

//=====================Clear Entire Cart (Authenticated User)=====================
router.delete(
  '/clear',
  auth,
  CartController.clearCart
);

export const CartRoutes = router;
