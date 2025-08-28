import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { stripe } from '../../lib/stripe';
import { ICreateCheckoutSession, ICheckoutSessionResponse, IPaymentWebhook } from '../../interface/payment.interface';
import AppError from '../../errors/AppError';

const createCheckoutSession = async (
  userId: string,
  payload: ICreateCheckoutSession
): Promise<ICheckoutSessionResponse> => {
  const { packageId, successUrl, cancelUrl } = payload;

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

  // Fetch AI credit package
  const creditPackage = await prisma.aiCreditPackage.findUnique({
    where: { id: packageId },
  });
  if (!creditPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'AI Credit Package not found');
  }
  if (creditPackage.status !== 'ACTIVE') {
    throw new AppError(httpStatus.BAD_REQUEST, 'This package is not available for purchase');
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
              name: creditPackage.name,
              description: `${creditPackage.credits} AI Credits`,
              metadata: {
                packageId: packageId,
                credits: creditPackage.credits.toString(),
              },
            },
            unit_amount: Math.round(creditPackage.price * 100), // Convert to cents
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
        credits: creditPackage.credits.toString(),
        amount: creditPackage.price.toString(),
      },
    });

    // Create payment record with pending status
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: creditPackage.price,
        currency: 'USD',
        status: 'PENDING',
        checkoutSessionId: session.id,
        metadata: {
          packageId: packageId,
          credits: creditPackage.credits,
          packageName: creditPackage.name,
        },
      },
    });

    // Create credit purchase record
    await prisma.creditPurchase.create({
      data: {
        userId,
        paymentId: payment.id,
        aiCreditPackageId: packageId,
        creditsPurchased: creditPackage.credits,
        amountPaid: creditPackage.price,
        status: 'PENDING',
      },
    });

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

  if (type === 'checkout.session.completed') {
    await handlePaymentSuccess(session);
  } else if (type === 'checkout.session.expired') {
    await handlePaymentExpired(session);
  }
};

const handlePaymentSuccess = async (session: any): Promise<void> => {
  try {
    const { userId, packageId, credits, amount } = session.metadata;

    // Update payment status
    await prisma.payment.updateMany({
      where: { checkoutSessionId: session.id },
      data: {
        status: 'SUCCEEDED',
        paymentIntentId: session.payment_intent,
      },
    });

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

    console.log(`Payment successful: User ${userId} received ${credits} credits`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

const handlePaymentExpired = async (session: any): Promise<void> => {
  try {
    // Update payment status
    await prisma.payment.updateMany({
      where: { checkoutSessionId: session.id },
      data: {
        status: 'FAILED',
      },
    });

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
