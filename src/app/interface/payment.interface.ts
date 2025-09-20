export interface ICreateCheckoutSession {
  packageId: string;
  packageType: 'ai-credit' | 'breeze-wallet' | 'tour'; // New field to distinguish package types
  successUrl: string;
  cancelUrl: string;
  amount?: number;
  adults?: number;
  children?: number;
  infants?: number;
  travelDate?: string;
}

export interface ICustomWalletTopup {
  amount: number;
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

// PayPal specific interfaces
export interface ICreatePayPalOrder {
  packageId: string;
  packageType: 'ai-credit' | 'breeze-wallet' | 'tour';
  successUrl: string;
  cancelUrl: string;
  amount?: number;
  adults?: number;
  children?: number;
  infants?: number;
  travelDate?: string;
}

export interface IPayPalOrderResponse {
  orderId: string;
  approvalUrl: string;
  successUrl: string;
  cancelUrl: string;
}

export interface IPayPalWebhook {
  event_type: string;
  resource: {
    id: string;
    state: string;
    [key: string]: any;
  };
}