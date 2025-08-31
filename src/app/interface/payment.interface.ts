export interface ICreateCheckoutSession {
  packageId: string;
  packageType: 'ai-credit' | 'breeze-wallet'; // New field to distinguish package types
  successUrl: string;
  cancelUrl: string;
}

export interface ICheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

// Updated to handle any Stripe webhook event type
export interface IPaymentWebhook {
  type: string;
  data: {
    object: any; // Allow any Stripe object for maximum flexibility
  };
}

export interface IPaymentSuccess {
  paymentId: string;
  sessionId: string;
  amount: number;
  credits: number;
  status: string;
}
