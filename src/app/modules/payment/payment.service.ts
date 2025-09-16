import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { stripe } from '../../lib/stripe';
import { createPayPalOrderAPI, verifyPayPalWebhook, capturePayPalOrder } from '../../lib/paypal';
import { ICreateCheckoutSession, ICheckoutSessionResponse, IPaymentWebhook, ICreatePayPalOrder, IPayPalOrderResponse, IPayPalWebhook } from '../../interface/payment.interface';
import AppError from '../../errors/AppError';
import { UserActivityService } from '../UserActivity/userActivity.service';

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
  } else if (packageType === 'tour') {
    // Handle tour booking
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: packageId },
    });

    if (!tourPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
    }

    packageData = tourPackage;
    packageName = tourPackage.packageName;
    packageDescription = `${tourPackage.packageName} - ${tourPackage.packageCategory}`;
    packageAmount = payload.amount || 0; // Amount should be calculated from passengers
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid package type. Must be "ai-credit", "breeze-wallet", or "tour"');
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
                ...(packageType === 'tour' ? { 
                  adults: payload.adults?.toString() || '0',
                  children: payload.children?.toString() || '0',
                  infants: payload.infants?.toString() || '0',
                  travelDate: payload.travelDate || ''
                } : {}),
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
        ...(packageType === 'tour' ? { 
          adults: payload.adults?.toString() || '0',
          children: payload.children?.toString() || '0',
          infants: payload.infants?.toString() || '0',
          travelDate: payload.travelDate || ''
        } : {}),
        amount: packageAmount.toString(),
      },
    });

    // Create payment record with pending status
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: packageAmount, // Store original amount
        currency: 'USD',
        status: 'PENDING',
        checkoutSessionId: session.id,
        metadata: {
          packageId: packageId,
          packageType: packageType,
          ...(packageType === 'ai-credit' ? { credits: packageData.credits, packageName: packageData.name } : {}),
          ...(packageType === 'breeze-wallet' ? { amount: packageData.amount, packageName: packageData.name } : {}),
          ...(packageType === 'tour' ? { 
            adults: payload.adults || 0,
            children: payload.children || 0,
            infants: payload.infants || 0,
            travelDate: payload.travelDate || null,
            packageName: packageData.packageName
          } : {}),
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
    } else if (packageType === 'tour') {
      await prisma.tourBooking.create({
        data: {
          userId,
          paymentId: payment.id,
          tourPackageId: packageId,
          adults: payload.adults || 0,
          children: payload.children || 0,
          infants: payload.infants || 0,
          totalAmount: packageAmount,
          travelDate: payload.travelDate ? new Date(payload.travelDate) : null,
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
    const { userId, packageId, packageType, credits, amount, adults, children, infants } = session.metadata;
    
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

      // Create user activity record
      await UserActivityService.createUserActivity({
        userId,
        type: 'AI_CREDIT_PURCHASE',
        title: 'AI Credit Package Booked',
        message: `AI Credit Package (${credits} credits) booked successfully`,
        metadata: {
          packageId,
          credits,
          amount: parseFloat(session.metadata.amount),
          paymentId: session.payment_intent,
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

      // Create user activity record
      await UserActivityService.createUserActivity({
        userId,
        type: 'WALLET_TOPUP',
        title: 'Wallet Topup Successful',
        message: `Wallet Topup ($${amount}) added successfully`,
        metadata: {
          packageId,
          amount,
          paymentId: session.payment_intent,
        },
      });
    } else if (packageType === 'custom-wallet-topup') {
      // Update breeze wallet purchase status for custom topup
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

      // Create user activity record
      await UserActivityService.createUserActivity({
        userId,
        type: 'WALLET_TOPUP',
        title: 'Custom Wallet Topup Successful',
        message: `Custom Wallet Topup ($${amount}) added successfully`,
        metadata: {
          packageId,
          amount,
          paymentId: session.payment_intent,
          isCustomTopup: true,
        },
      });

      console.log('✅ Stripe Custom Wallet Topup processed successfully:', {
        userId,
        amountAdded: parseFloat(amount),
        packageId,
      });
    } else if (packageType === 'tour') {
      // Update tour booking status
      await prisma.tourBooking.updateMany({
        where: {
          payment: {
            checkoutSessionId: session.id,
          },
        },
        data: {
          status: 'CONFIRMED',
        },
      });


      // Get tour package details for cashback calculation
      const tourPackage = await prisma.tourPackage.findUnique({
        where: { id: packageId },
        select: { breezeCredit: true, packageName: true },
      });

      // Calculate and add cashback to Breeze Wallet
      if (tourPackage && tourPackage.breezeCredit > 0) {
        const totalAmount = parseFloat(amount);
        const cashbackAmount = (totalAmount * tourPackage.breezeCredit) / 100;
        
        // Add cashback to user's Breeze Wallet
        await prisma.user.update({
          where: { id: userId },
          data: {
            breezeWalletBalance: {
              increment: cashbackAmount,
            },
          },
        });

        // Create user activity for cashback
        await UserActivityService.createUserActivity({
          userId,
          type: 'WALLET_TOPUP',
          title: 'Tour Booking Cashback',
          message: `$${cashbackAmount.toFixed(2)} cashback added to Breeze Wallet (${tourPackage.breezeCredit}% of tour booking)`,
          metadata: {
            type: 'tour_cashback',
            tourPackageId: packageId,
            tourPackageName: tourPackage.packageName,
            cashbackPercentage: tourPackage.breezeCredit,
            cashbackAmount,
            originalAmount: totalAmount,
            paymentId: session.payment_intent,
          },
        });
      }

      // Create user activity record for tour booking
      await UserActivityService.createUserActivity({
        userId,
        type: 'TOUR_BOOKING',
        title: 'Tour Package Booked',
        message: `Tour package booked successfully for ${adults} adults, ${children} children, ${infants} infants`,
        metadata: {
          packageId,
          adults: parseInt(adults || '0'),
          children: parseInt(children || '0'),
          infants: parseInt(infants || '0'),
          amount: parseFloat(amount),
          paymentId: session.payment_intent,
          cashbackEarned: tourPackage?.breezeCredit ? (parseFloat(amount) * tourPackage.breezeCredit) / 100 : 0,
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
      tourBooking: {
        include: {
          tourPackage: {
            select: {
              id: true,
              packageName: true,
              packageCategory: true,
              packagePriceAdult: true,
              packagePriceChild: true,
              packagePriceInfant: true,
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

const getPaymentBySessionId = async (sessionId: string, userId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { checkoutSessionId: sessionId, userId },
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
      tourBooking: {
        include: {
          tourPackage: {
            select: {
              id: true,
              packageName: true,
              packageCategory: true,
              packagePriceAdult: true,
              packagePriceChild: true,
              packagePriceInfant: true,
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

// PayPal service methods
const createPayPalOrder = async (
  userId: string,
  payload: ICreatePayPalOrder
): Promise<IPayPalOrderResponse> => {
  const { packageId, packageType, successUrl, cancelUrl } = payload;

  // Debug PayPal configuration
  console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID);
  console.log('PayPal Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? 'Set' : 'Not set');
  console.log('PayPal Mode:', process.env.PAYPAL_MODE);

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

  let packageData: any;
  let packageName: string;
  let packageDescription: string;
  let packageAmount: number;

  // Fetch package based on type (same logic as Stripe)
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
  } else if (packageType === 'tour') {
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: packageId },
    });

    if (!tourPackage) {
      throw new AppError(httpStatus.NOT_FOUND, 'Tour package not found');
    }

    packageData = tourPackage;
    packageName = tourPackage.packageName;
    packageDescription = `${tourPackage.packageName} - ${tourPackage.packageCategory}`;
    packageAmount = payload.amount || 0;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid package type. Must be "ai-credit", "breeze-wallet", or "tour"');
  }

  try {
    // Create PayPal order using REST API
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: packageAmount.toString(),
        },
        description: packageDescription,
        custom_id: `${packageType}-${packageId}-${userId}`,
        metadata: {
          packageId,
          packageType,
          userId,
          ...(packageType === 'ai-credit' ? { credits: packageData.credits.toString() } : {}),
          ...(packageType === 'breeze-wallet' ? { amount: packageData.amount.toString() } : {}),
          ...(packageType === 'tour' ? { 
            adults: payload.adults?.toString() || '0',
            children: payload.children?.toString() || '0',
            infants: payload.infants?.toString() || '0',
            travelDate: payload.travelDate || ''
          } : {}),
        }
      }],
      application_context: {
        return_url: successUrl,
        cancel_url: cancelUrl,
        brand_name: 'Kenny Rappose',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      }
    };

    console.log('🔧 Creating PayPal order with request:', JSON.stringify(orderRequest, null, 2));
    
    const result = await createPayPalOrderAPI(orderRequest);
    
    console.log('🔧 PayPal Order Created:', {
      orderId: result.id,
      userId: userId,
      amount: packageAmount,
      packageType: packageType
    });
    
    // Create payment record in database
    console.log('🔧 Creating payment record in database...');
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: packageAmount,
        currency: 'USD',
        status: 'PENDING',
        paymentMethod: 'PAYPAL',
        externalPaymentId: result.id,
        metadata: {
          packageId,
          packageType,
          ...(packageType === 'ai-credit' ? { credits: packageData.credits, packageName: packageData.name } : {}),
          ...(packageType === 'breeze-wallet' ? { amount: packageData.amount, packageName: packageData.name } : {}),
          ...(packageType === 'tour' ? { 
            adults: payload.adults || 0,
            children: payload.children || 0,
            infants: payload.infants || 0,
            travelDate: payload.travelDate || null,
            packageName: packageData.packageName
          } : {}),
        },
      },
    });

    console.log('✅ Payment record created successfully:', {
      paymentId: payment.id,
      externalPaymentId: payment.externalPaymentId,
      amount: payment.amount,
      status: payment.status
    });

    // Create appropriate purchase record (same as Stripe)
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
    } else if (packageType === 'tour') {
      await prisma.tourBooking.create({
        data: {
          userId,
          paymentId: payment.id,
          tourPackageId: packageId,
          adults: payload.adults || 0,
          children: payload.children || 0,
          infants: payload.infants || 0,
          totalAmount: packageAmount,
          travelDate: payload.travelDate ? new Date(payload.travelDate) : null,
          status: 'PENDING',
        },
      });
    }

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
    console.error('PayPal order creation error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create PayPal order. Please try again.'
    );
  }
};

const handlePayPalWebhook = async (payload: IPayPalWebhook, headers: any): Promise<void> => {
  try {
    console.log('🔔 PayPal Webhook Received:', {
      timestamp: new Date().toISOString(),
      eventType: payload.event_type,
      resourceId: payload.resource?.id,
      headers: {
        'paypal-transmission-id': headers['paypal-transmission-id'],
        'paypal-cert-id': headers['paypal-cert-id'],
        'paypal-transmission-sig': headers['paypal-transmission-sig'] ? 'present' : 'missing'
      }
    });

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(payload, headers);
    if (!isValid) {
      console.error('❌ Invalid PayPal webhook signature');
      throw new Error('Invalid webhook signature');
    }

    const { event_type, resource } = payload;
    console.log(`🔄 Processing PayPal webhook event: ${event_type}`);

    // Handle different PayPal events
    switch (event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('✅ Payment Success Event Received');
        await handlePaymentCompleted(resource, payload);
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
        console.log('❌ Payment Denied Event Received');
        await handlePaymentDenied(resource);
        break;
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log('🔄 Payment Refunded Event Received');
        await handlePaymentRefunded(resource);
        break;
      
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('✅ Order Approved Event Received');
        await handleOrderApproved(resource);
        break;
      
      case 'CHECKOUT.ORDER.VOIDED':
        console.log('❌ Order Voided Event Received');
        await handleOrderVoided(resource);
        break;
      
      default:
        console.log(`⚠️ Unhandled PayPal webhook event: ${event_type}`);
    }

    console.log('✅ PayPal webhook processed successfully');
  } catch (error) {
    console.error('❌ PayPal webhook processing error:', error);
    throw error; // Re-throw to return 500 status
  }
};

// Handle successful payment
const handlePaymentCompleted = async (resource: any, fullPayload?: any): Promise<void> => {
  const captureId = resource.id;
  console.log('💰 Payment Success Details:', {
    captureId,
    amount: resource.amount?.value,
    currency: resource.amount?.currency_code,
    status: resource.status,
    timestamp: new Date().toISOString()
  });
  
  // Find payment by external payment ID (order ID, not capture ID)
  // For PAYMENT.CAPTURE.COMPLETED, we need to find the original order ID
  // The order ID should be in supplementary_data.related_ids.order_id
  let orderId = resource.supplementary_data?.related_ids?.order_id ||
                resource.supplementary_data?.related_id || 
                resource.purchase_units?.[0]?.payments?.captures?.[0]?.supplementary_data?.related_id ||
                resource.purchase_units?.[0]?.reference_id ||
                resource.custom_id;
  
  console.log('🔍 Looking for order ID:', orderId);
  console.log('🔍 Full resource structure:', JSON.stringify(resource, null, 2));
  
  // If we can't find the order ID, let's try to find the payment by amount and recent timestamp
  if (!orderId) {
    console.log('🔍 Order ID not found, trying to find payment by amount and recent timestamp...');
    const amount = parseFloat(resource.amount?.value || '0');
    const currency = resource.amount?.currency_code || 'USD';
    
    // Find recent pending payments with matching amount
    const recentPayment = await prisma.payment.findFirst({
      where: {
        amount: amount,
        currency: currency,
        status: 'PENDING',
        paymentMethod: 'PAYPAL',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (recentPayment) {
      orderId = recentPayment.externalPaymentId;
      console.log('🔍 Found payment by amount match:', {
        paymentId: recentPayment.id,
        orderId: orderId,
        amount: recentPayment.amount
      });
    }
  }
  
  if (!orderId) {
    console.error('❌ Order ID not found in capture resource:', captureId);
    return;
  }
  
  const payment = await prisma.payment.findFirst({
    where: { externalPaymentId: orderId }
  });
  
  if (!payment) {
    console.error('❌ Payment not found for PayPal order:', orderId);
    
    // Debug: Let's see what payments exist in the database
    const recentPayments = await prisma.payment.findMany({
      where: {
        paymentMethod: 'PAYPAL',
        status: 'PENDING',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        id: true,
        externalPaymentId: true,
        amount: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
    
    console.log('🔍 Recent PayPal payments in database:', recentPayments);
    return;
  }

  console.log('✅ Payment found in database:', {
    paymentId: payment.id,
    userId: payment.userId,
    amount: payment.amount,
    status: payment.status,
    packageType: (payment.metadata as any)?.packageType
  });
  
  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'SUCCEEDED' }
  });

  console.log('✅ Payment status updated to SUCCEEDED');
  
  // Update related purchase records based on package type
  const metadata = payment.metadata as any;
  const packageType = metadata.packageType;
  
  console.log('📦 Processing package type:', packageType);
  
  if (packageType === 'ai-credit') {
    await prisma.creditPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'COMPLETED' }
    });
    
    // Add credits to user
    await prisma.user.update({
      where: { id: payment.userId },
      data: { 
        aiCredits: { 
          increment: metadata.credits || 0 
        } 
      }
    });

    // Create user activity record
    await UserActivityService.createUserActivity({
      userId: payment.userId,
      type: 'AI_CREDIT_PURCHASE',
      title: 'AI Credit Package Booked',
      message: `AI Credit Package (${metadata.credits} credits) booked successfully`,
      metadata: {
        packageId: metadata.packageId,
        credits: metadata.credits,
        amount: payment.amount,
        paymentId: payment.id,
      },
    });

    console.log('✅ AI Credit Package processed successfully:', {
      userId: payment.userId,
      creditsAdded: metadata.credits,
      packageId: metadata.packageId
    });
  } else if (packageType === 'breeze-wallet') {
    await prisma.breezeWalletPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'COMPLETED' }
    });
    
    // Add to user's breeze wallet
    await prisma.user.update({
      where: { id: payment.userId },
      data: { 
        breezeWalletBalance: { 
          increment: metadata.amount || 0 
        } 
      }
    });

    // Create user activity record
    await UserActivityService.createUserActivity({
      userId: payment.userId,
      type: 'WALLET_TOPUP',
      title: 'Wallet Topup Successful',
      message: `Wallet Topup ($${metadata.amount}) added successfully`,
      metadata: {
        packageId: metadata.packageId,
        amount: metadata.amount,
        paymentId: payment.id,
      },
    });

    console.log('✅ Breeze Wallet Topup processed successfully:', {
      userId: payment.userId,
      amountAdded: metadata.amount,
      packageId: metadata.packageId
    });
  } else if (packageType === 'custom-wallet-topup') {
    await prisma.breezeWalletPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'COMPLETED' }
    });
    
    // Add to user's breeze wallet
    await prisma.user.update({
      where: { id: payment.userId },
      data: { 
        breezeWalletBalance: { 
          increment: metadata.amount || 0 
        } 
      }
    });

    // Create user activity record
    await UserActivityService.createUserActivity({
      userId: payment.userId,
      type: 'WALLET_TOPUP',
      title: 'Custom Wallet Topup Successful',
      message: `Custom Wallet Topup ($${metadata.amount}) added successfully`,
      metadata: {
        packageId: metadata.packageId,
        amount: metadata.amount,
        paymentId: payment.id,
        isCustomTopup: true
      },
    });

    console.log('✅ Custom Wallet Topup processed successfully:', {
      userId: payment.userId,
      amountAdded: metadata.amount,
      packageId: metadata.packageId
    });
  } else if (packageType === 'tour') {
    await prisma.tourBooking.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'CONFIRMED' }
    });

    // Get tour package details for cashback calculation
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: metadata.packageId },
      select: { breezeCredit: true, packageName: true },
    });

    // Calculate and add cashback to Breeze Wallet
    if (tourPackage && tourPackage.breezeCredit > 0) {
      const totalAmount = payment.amount;
      const cashbackAmount = (totalAmount * tourPackage.breezeCredit) / 100;
      
      // Add cashback to user's Breeze Wallet
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          breezeWalletBalance: {
            increment: cashbackAmount,
          },
        },
      });

      // Create user activity for cashback
      await UserActivityService.createUserActivity({
        userId: payment.userId,
        type: 'WALLET_TOPUP',
        title: 'Tour Booking Cashback',
        message: `$${cashbackAmount.toFixed(2)} cashback added to Breeze Wallet (${tourPackage.breezeCredit}% of tour booking)`,
        metadata: {
          type: 'tour_cashback',
          tourPackageId: metadata.packageId,
          tourPackageName: tourPackage.packageName,
          cashbackPercentage: tourPackage.breezeCredit,
          cashbackAmount,
          originalAmount: totalAmount,
          paymentId: payment.id,
        },
      });
    }

    // Create user activity record for tour booking
    await UserActivityService.createUserActivity({
      userId: payment.userId,
      type: 'TOUR_BOOKING',
      title: 'Tour Package Booked',
      message: `Tour package booked successfully for ${metadata.adults} adults, ${metadata.children} children, ${metadata.infants} infants`,
      metadata: {
        packageId: metadata.packageId,
        adults: metadata.adults || 0,
        children: metadata.children || 0,
        infants: metadata.infants || 0,
        amount: payment.amount,
        paymentId: payment.id,
        cashbackEarned: tourPackage?.breezeCredit ? (payment.amount * tourPackage.breezeCredit) / 100 : 0,
      },
    });

    console.log('✅ Tour Package booking processed successfully:', {
      userId: payment.userId,
      packageId: metadata.packageId,
      adults: metadata.adults || 0,
      children: metadata.children || 0,
      infants: metadata.infants || 0,
      totalAmount: payment.amount,
      cashbackEarned: tourPackage?.breezeCredit ? (payment.amount * tourPackage.breezeCredit) / 100 : 0
    });
  }

  console.log('🎉 Payment processing completed successfully for all package types');
};

// Handle failed payment
const handlePaymentDenied = async (resource: any): Promise<void> => {
  const orderId = resource.id;
  
  console.log('❌ Payment Denied Details:', {
    orderId,
    reason: resource.reason_code,
    amount: resource.amount?.value,
    currency: resource.amount?.currency_code,
    timestamp: new Date().toISOString()
  });
  
  const payment = await prisma.payment.findFirst({
    where: { externalPaymentId: orderId }
  });
  
  if (!payment) {
    console.error('❌ Payment not found for PayPal order:', orderId);
    return;
  }

  console.log('✅ Payment found in database for denial:', {
    paymentId: payment.id,
    userId: payment.userId,
    amount: payment.amount,
    currentStatus: payment.status
  });
  
  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'FAILED' }
  });

  console.log('❌ Payment status updated to FAILED');
  
  // Update related purchase records
  const metadata = payment.metadata as any;
  const packageType = metadata.packageType;
  
  if (packageType === 'ai-credit') {
    await prisma.creditPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'FAILED' }
    });
  } else if (packageType === 'breeze-wallet') {
    await prisma.breezeWalletPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'FAILED' }
    });
  } else if (packageType === 'tour') {
    await prisma.tourBooking.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'CANCELLED' }
    });
  }
};

// Handle refunded payment
const handlePaymentRefunded = async (resource: any): Promise<void> => {
  const orderId = resource.id;
  
  console.log('🔄 Payment Refunded Details:', {
    orderId,
    refundAmount: resource.amount?.value,
    currency: resource.amount?.currency_code,
    refundId: resource.id,
    timestamp: new Date().toISOString()
  });
  
  const payment = await prisma.payment.findFirst({
    where: { externalPaymentId: orderId }
  });
  
  if (!payment) {
    console.error('❌ Payment not found for PayPal order:', orderId);
    return;
  }

  console.log('✅ Payment found in database for refund:', {
    paymentId: payment.id,
    userId: payment.userId,
    amount: payment.amount,
    currentStatus: payment.status
  });
  
  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'CANCELED' }
  });

  console.log('🔄 Payment status updated to CANCELED');
  
  // Update related purchase records
  const metadata = payment.metadata as any;
  const packageType = metadata.packageType;
  
  if (packageType === 'ai-credit') {
    await prisma.creditPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'REFUNDED' }
    });
    
    // Remove credits from user
    await prisma.user.update({
      where: { id: payment.userId },
      data: { 
        aiCredits: { 
          decrement: metadata.credits || 0 
        } 
      }
    });
  } else if (packageType === 'breeze-wallet') {
    await prisma.breezeWalletPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'REFUNDED' }
    });
    
    // Remove wallet balance from user
    await prisma.user.update({
      where: { id: payment.userId },
      data: { 
        breezeWalletBalance: { 
          decrement: metadata.amount || 0 
        } 
      }
    });
  } else if (packageType === 'tour') {
    await prisma.tourBooking.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'REFUNDED' }
    });
  }
};

// Handle order approved - capture the payment
const handleOrderApproved = async (resource: any): Promise<void> => {
  const orderId = resource.id;
  console.log('Order approved, capturing payment:', orderId);
  
  try {
    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(orderId);
    console.log('Order captured successfully:', captureResult.id);
    
    // The capture will trigger PAYMENT.CAPTURE.COMPLETED webhook
    // which will handle the actual payment processing
  } catch (error) {
    console.error('Failed to capture PayPal order:', error);
    throw error;
  }
};

// Handle voided order
const handleOrderVoided = async (resource: any): Promise<void> => {
  const orderId = resource.id;
  
  const payment = await prisma.payment.findFirst({
    where: { externalPaymentId: orderId }
  });
  
  if (!payment) {
    console.error('Payment not found for PayPal order:', orderId);
    return;
  }
  
  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'CANCELED' }
  });
  
  // Update related purchase records
  const metadata = payment.metadata as any;
  const packageType = metadata.packageType;
  
  if (packageType === 'ai-credit') {
    await prisma.creditPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'FAILED' }
    });
  } else if (packageType === 'breeze-wallet') {
    await prisma.breezeWalletPurchase.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'FAILED' }
    });
  } else if (packageType === 'tour') {
    await prisma.tourBooking.updateMany({
      where: { paymentId: payment.id },
      data: { status: 'CANCELLED' }
    });
  }
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getPaymentById,
  getPaymentBySessionId,
  createPayPalOrder,
  handlePayPalWebhook,
};
