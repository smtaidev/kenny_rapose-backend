import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import sendResponse from '../../utils/sendResponse';
import { CustomWalletTopupService } from './custom-wallet-topup.service';

const createCustomWalletTopup = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;
  
  console.log('🎯 Custom Wallet Topup Controller - Request received:', {
    userId,
    amount: payload.amount,
    timestamp: new Date().toISOString()
  });
  
  const result = await CustomWalletTopupService.createCustomWalletTopup(userId!, payload);

  console.log('✅ Custom Wallet Topup Controller - Order created successfully');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom wallet topup order created successfully',
    data: result,
  });
};

export const CustomWalletTopupController = {
  createCustomWalletTopup,
};
