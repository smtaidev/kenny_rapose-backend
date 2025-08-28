export interface ICreateCheckoutSession {
  packageId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface ICheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

export interface IPaymentWebhook {
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      amount_total: number;
      currency: string;
      customer: string;
      metadata: Record<string, any>;
      payment_intent?: string;
    };
  };
}

export interface IPaymentSuccess {
  paymentId: string;
  sessionId: string;
  amount: number;
  credits: number;
  status: string;
}
