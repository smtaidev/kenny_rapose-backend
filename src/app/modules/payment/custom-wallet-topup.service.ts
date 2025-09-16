import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICustomWalletTopup } from '../../interface/payment.interface';
import { createPayPalOrderAPI } from '../../lib/paypal';
import prisma from '../../utils/prisma';

// Create custom wallet topup order
const createCustomWalletTopup = async (
  userId: string,
  payload: ICustomWalletTopup
): Promise<{ orderId: string; approvalUrl: string }> => {
  try {
    const { amount, successUrl, cancelUrl } = payload;

    console.log('🔧 Creating custom wallet topup:', {
      userId,
      amount,
      successUrl,
      cancelUrl
    });

    // Check if PayPal is configured
    if (!process.env.PAYPAL_CLIENT_ID) {
      throw new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        'PayPal payment system is not configured. Please contact support.'
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Validate amount
    if (amount < 5 || amount > 1000) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Amount must be between $5 and $1000'
      );
    }

    // Create PayPal order request
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toString()
          },
          description: `Custom Wallet Topup - $${amount}`,
          custom_id: `custom-wallet-topup-${userId}-${Date.now()}`,
          metadata: {
            packageId: 'custom-wallet-topup',
            packageType: 'custom-wallet-topup',
            userId: userId,
            amount: amount.toString()
          }
        }
      ],
      application_context: {
        return_url: successUrl,
        cancel_url: cancelUrl,
        brand_name: 'Kenny Rappose',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      }
    };

    console.log('🔧 Creating PayPal order for custom wallet topup:', JSON.stringify(orderRequest, null, 2));
    
    const result = await createPayPalOrderAPI(orderRequest);
    
    console.log('🔧 PayPal Order Created for custom wallet topup:', {
      orderId: result.id,
      userId: userId,
      amount: amount,
      packageType: 'custom-wallet-topup'
    });
    
    // Create payment record in database
    console.log('🔧 Creating payment record in database for custom wallet topup...');
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: amount,
        currency: 'USD',
        status: 'PENDING',
        paymentMethod: 'PAYPAL',
        externalPaymentId: result.id,
        metadata: {
          packageId: 'custom-wallet-topup',
          packageType: 'custom-wallet-topup',
          amount: amount,
          packageName: `Custom Wallet Topup - $${amount}`
        },
      },
    });

    console.log('✅ Payment record created successfully for custom wallet topup:', {
      paymentId: payment.id,
      externalPaymentId: payment.externalPaymentId,
      amount: payment.amount,
      status: payment.status
    });

    // Create or find a special package for custom topups
    let customTopupPackage = await prisma.breezeWalletPackage.findFirst({
      where: { name: 'Custom Wallet Topup' }
    });

    if (!customTopupPackage) {
      customTopupPackage = await prisma.breezeWalletPackage.create({
        data: {
          name: 'Custom Wallet Topup',
          amount: 0, // Variable amount
          price: 0, // Variable price
          status: 'ACTIVE'
        }
      });
    }

    // Create breeze wallet purchase record for custom topup
    await prisma.breezeWalletPurchase.create({
      data: {
        userId,
        paymentId: payment.id,
        breezeWalletPackageId: customTopupPackage.id,
        amountPurchased: amount,
        amountPaid: amount,
        status: 'PENDING',
      },
    });

    console.log('✅ Breeze wallet purchase record created for custom topup');

    // Find approval URL
    const approvalUrl = result.links?.find((link: any) => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get PayPal approval URL');
    }

    return {
      orderId: result.id || '',
      approvalUrl: approvalUrl,
    };
  } catch (error: any) {
    console.error('Custom wallet topup creation error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create custom wallet topup order. Please try again.'
    );
  }
};

export const CustomWalletTopupService = {
  createCustomWalletTopup,
};
