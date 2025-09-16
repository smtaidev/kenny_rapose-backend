import { Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth';
import { StripeCustomWalletTopupService } from './stripe-custom-wallet-topup.service';
import { ICustomWalletTopup } from '../../interface/payment.interface';

const createStripeCustomWalletTopup = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const payload: ICustomWalletTopup = req.body;

  console.log('🎯 Stripe Custom Wallet Topup Controller - Request received:', {
    userId,
    amount: payload.amount,
    timestamp: new Date().toISOString()
  });
  
  const result = await StripeCustomWalletTopupService.createStripeCustomWalletTopup(userId!, payload);

  console.log('✅ Stripe Custom Wallet Topup Controller - Session created successfully');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stripe custom wallet topup session created successfully',
    data: result,
  });
});

export const StripeCustomWalletTopupController = {
  createStripeCustomWalletTopup,
};
