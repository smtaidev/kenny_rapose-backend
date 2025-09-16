import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICustomWalletTopup } from '../../interface/payment.interface';
import { stripe } from '../../lib/stripe';
import prisma from '../../utils/prisma';
import { UserActivityService } from '../UserActivity/userActivity.service';

// Create Stripe custom wallet topup checkout session
const createStripeCustomWalletTopup = async (
  userId: string,
  payload: ICustomWalletTopup
) => {
  const { amount, successUrl, cancelUrl } = payload;

  // Debug Stripe configuration
  console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set');
  console.log('Stripe Mode:', process.env.NODE_ENV);

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      'Stripe payment system is not configured. Please contact support.'
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

  try {
    console.log('🔧 Creating Stripe custom wallet topup:', { userId, amount, successUrl, cancelUrl });

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

    // Create Stripe checkout session for custom wallet topup
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Custom Wallet Topup - $${amount}`,
              description: `Add $${amount} to your Breeze Wallet`,
              metadata: {
                packageId: 'custom-wallet-topup',
                packageType: 'custom-wallet-topup',
                userId: userId,
                amount: amount.toString(),
              },
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        packageId: 'custom-wallet-topup',
        packageType: 'custom-wallet-topup',
        amount: amount.toString(),
        packageName: `Custom Wallet Topup - $${amount}`,
      },
    });

    console.log('🔧 Stripe Checkout Session Created for custom wallet topup:', {
      sessionId: session.id,
      userId: userId,
      amount: amount,
      packageType: 'custom-wallet-topup'
    });

    // Create payment record in database
    console.log('🔧 Creating payment record in database for Stripe custom wallet topup...');
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: amount,
        currency: 'USD',
        status: 'PENDING',
        paymentMethod: 'STRIPE',
        externalPaymentId: session.id,
        metadata: {
          packageId: 'custom-wallet-topup',
          packageType: 'custom-wallet-topup',
          amount: amount,
          packageName: `Custom Wallet Topup - $${amount}`,
        },
      },
    });

    console.log('✅ Payment record created successfully for Stripe custom wallet topup:', {
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

    console.log('✅ Breeze wallet purchase record created for Stripe custom topup');

    return {
      sessionId: session.id,
      sessionUrl: session.url!,
    };
  } catch (error: any) {
    console.error('❌ Stripe custom wallet topup creation error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create Stripe custom wallet topup session. Please try again.'
    );
  }
};

export const StripeCustomWalletTopupService = {
  createStripeCustomWalletTopup,
};
