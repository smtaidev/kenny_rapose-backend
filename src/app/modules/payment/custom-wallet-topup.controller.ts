import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthRequest } from '../../middlewares/auth';
import sendResponse from '../../utils/sendResponse';
import { CustomWalletTopupService } from './custom-wallet-topup.service';

const createCustomWalletTopup = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;
  
  
  const result = await CustomWalletTopupService.createCustomWalletTopup(userId!, payload);


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
