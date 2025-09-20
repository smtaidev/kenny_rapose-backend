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

  
  const result = await StripeCustomWalletTopupService.createStripeCustomWalletTopup(userId!, payload);

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
