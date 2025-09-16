import { Response } from 'express';
import { PaymentService } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth';
import { stripe } from '../../lib/stripe';

const createCheckoutSession = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;
  
  const result = await PaymentService.createCheckoutSession(userId!, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Checkout session created successfully',
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: any, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  
  if (!sig) {
    return res.status(400).send('Missing stripe-signature header');
  }

  try {
    // Use configured Stripe instance instead of creating new one
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await PaymentService.handleWebhook(event);
    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const getPaymentHistory = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  
  const result = await PaymentService.getPaymentHistory(userId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment history retrieved successfully',
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { paymentId } = req.params;
  
  const result = await PaymentService.getPaymentById(paymentId, userId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment details retrieved successfully',
    data: result,
  });
});

const getPaymentBySessionId = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { sessionId } = req.params;
  
  const result = await PaymentService.getPaymentBySessionId(sessionId, userId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment details retrieved successfully',
    data: result,
  });
});

// PayPal controller methods
const createPayPalOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;
  
  const result = await PaymentService.createPayPalOrder(userId!, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PayPal order created successfully',
    data: result,
  });
});

const handlePayPalWebhook = catchAsync(async (req: any, res: Response) => {
  const payload = req.body;
  const headers = req.headers;
  
  console.log('🎯 PayPal Webhook Controller - Request received:', {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    eventType: payload?.event_type,
    resourceId: payload?.resource?.id
  });
  
  await PaymentService.handlePayPalWebhook(payload, headers);
  
  console.log('✅ PayPal Webhook Controller - Response sent successfully');
  res.json({ received: true });
});

export const PaymentController = {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getPaymentById,
  getPaymentBySessionId,
  createPayPalOrder,
  handlePayPalWebhook,
};
