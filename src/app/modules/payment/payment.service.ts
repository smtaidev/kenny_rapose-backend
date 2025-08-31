import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { stripe } from '../../lib/stripe';
import { ICreateCheckoutSession, ICheckoutSessionResponse, IPaymentWebhook } from '../../interface/payment.interface';
import AppError from '../../errors/AppError';

const createCheckoutSession = async (
  userId: string,
  payload: ICreateCheckoutSession
): Promise<ICheckoutSessionResponse> => {
  const { packageId, packageType, successUrl, cancelUrl } = payload;

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      'Payment system is not configured. Please contact support.'
    );
  }

  // Fetch user
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  let packageData: any;
  let packageName: string;
  let packageDescription: string;
  let packageAmount: number;

  // Fetch package based on type
  if (packageType === 'ai-credit') {
    const creditPackage = await prisma.aiCreditPackage.findUnique({
      where: { id: packageId },
    });
    if (!creditPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'AI Credit Package not found');
    }
    if (creditPackage.status !== 'ACTIVE') {
      throw new AppError(httpStatus.BAD_REQUEST, 'This package is not available for purchase');
    }
    
    packageData = creditPackage;
    packageName = creditPackage.name;
    packageDescription = `${creditPackage.credits} AI Credits`;
    packageAmount = creditPackage.price;
  } else if (packageType === 'breeze-wallet') {
    const walletPackage = await prisma.breezeWalletPackage.findUnique({
      where: { id: packageId },
    });
    if (!walletPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'Breeze Wallet Package not found');
    }
    if (walletPackage.status !== 'ACTIVE') {
      throw new AppError(httpStatus.BAD_REQUEST, 'This package is not available for purchase');
    }
    
    packageData = walletPackage;
    packageName = walletPackage.name;
    packageDescription = `$${walletPackage.amount} Wallet Credit`;
    packageAmount = walletPackage.price;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid package type. Must be "ai-credit" or "breeze-wallet"');
  }

  try {
    // Handle Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: userId,
        },
      });
      
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });
      customerId = customer.id;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageName,
              description: packageDescription,
              metadata: {
                packageId: packageId,
                packageType: packageType,
                ...(packageType === 'ai-credit' ? { credits: packageData.credits.toString() } : {}),
                ...(packageType === 'breeze-wallet' ? { amount: packageData.amount.toString() } : {}),
              },
            },
            unit_amount: Math.round(packageAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        packageId: packageId,
        packageType: packageType,
        ...(packageType === 'ai-credit' ? { credits: packageData.credits.toString() } : {}),
        ...(packageType === 'breeze-wallet' ? { amount: packageData.amount.toString() } : {}),
        amount: packageAmount.toString(),
      },
    });

    // Create payment record with pending status
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: packageAmount,
        currency: 'USD',
        status: 'PENDING',
        checkoutSessionId: session.id,
        metadata: {
          packageId: packageId,
          packageType: packageType,
          ...(packageType === 'ai-credit' ? { credits: packageData.credits, packageName: packageData.name } : {}),
          ...(packageType === 'breeze-wallet' ? { amount: packageData.amount, packageName: packageData.name } : {}),
        },
      },
    });

    // Create appropriate purchase record based on package type
    if (packageType === 'ai-credit') {
      await prisma.creditPurchase.create({
        data: {
          userId,
          paymentId: payment.id,
          aiCreditPackageId: packageId,
          creditsPurchased: packageData.credits,
          amountPaid: packageAmount,
          status: 'PENDING',
        },
      });
    } else if (packageType === 'breeze-wallet') {
      await prisma.breezeWalletPurchase.create({
        data: {
          userId,
          paymentId: payment.id,
          breezeWalletPackageId: packageId,
          amountPurchased: packageData.amount,
          amountPaid: packageAmount,
          status: 'PENDING',
        },
      });
    }

    return {
      sessionId: session.id,
      sessionUrl: session.url!,
    };
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create checkout session. Please try again.'
    );
  }
};

const handleWebhook = async (payload: IPaymentWebhook): Promise<void> => {
  const { type, data } = payload;
  const session = data.object;

  // Add proper event type checking
  if (type === 'checkout.session.completed') {
    await handlePaymentSuccess(session);
  } else if (type === 'checkout.session.expired') {
    await handlePaymentExpired(session);
  } else {
    console.log(`Unhandled webhook event type: ${type}`);
  }
};

const handlePaymentSuccess = async (session: any): Promise<void> => {
  try {
    const { userId, packageId, packageType, credits, amount } = session.metadata;
    
    // Update payment status
    await prisma.payment.updateMany({
      where: { checkoutSessionId: session.id },
      data: {
        status: 'SUCCEEDED',
        paymentIntentId: session.payment_intent,
      },
    });

    if (packageType === 'ai-credit') {
      // Update credit purchase status
      await prisma.creditPurchase.updateMany({
        where: {
          payment: {
            checkoutSessionId: session.id,
          },
        },
        data: {
          status: 'COMPLETED',
        },
      });

      // Add credits to user
      await prisma.user.update({
        where: { id: userId },
        data: {
          aiCredits: {
            increment: parseInt(credits),
          },
        },
      });
    } else if (packageType === 'breeze-wallet') {
      // Update breeze wallet purchase status
      await prisma.breezeWalletPurchase.updateMany({
        where: {
          payment: {
            checkoutSessionId: session.id,
          },
        },
        data: {
          status: 'COMPLETED',
        },
      });

      // Add amount to user's breeze wallet
      await prisma.user.update({
        where: { id: userId },
        data: {
          breezeWalletBalance: {
            increment: parseFloat(amount),
          },
        },
      });
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

const handlePaymentExpired = async (session: any): Promise<void> => {
  try {
    const { packageType } = session.metadata;
    
    // Update payment status
    await prisma.payment.updateMany({
      where: { checkoutSessionId: session.id },
      data: {
        status: 'FAILED',
      },
    });

    if (packageType === 'ai-credit') {
      // Update credit purchase status
      await prisma.creditPurchase.updateMany({
        where: {
          payment: {
            checkoutSessionId: session.id,
          },
        },
        data: {
          status: 'FAILED',
        },
      });
    } else if (packageType === 'breeze-wallet') {
      // Update breeze wallet purchase status
      await prisma.breezeWalletPurchase.updateMany({
        where: {
          payment: {
            checkoutSessionId: session.id,
          },
        },
        data: {
          status: 'FAILED',
        },
      });
    }

    console.log(`Payment expired: Session ${session.id}`);
  } catch (error) {
    console.error('Error handling payment expiration:', error);
    throw error;
  }
};

const getPaymentHistory = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    include: {
      creditPurchase: {
        include: {
          aiCreditPackage: {
            select: {
              name: true,
              credits: true,
            },
          },
        },
      },
      breezeWalletPurchase: {
        include: {
          breezeWalletPackage: {
            select: {
              name: true,
              amount: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return payments;
};

const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId },
    include: {
      creditPurchase: {
        include: {
          aiCreditPackage: {
            select: {
              name: true,
              credits: true,
            },
          },
        },
      },
      breezeWalletPurchase: {
        include: {
          breezeWalletPackage: {
            select: {
              name: true,
              amount: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  return payment;
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getPaymentById,
};
