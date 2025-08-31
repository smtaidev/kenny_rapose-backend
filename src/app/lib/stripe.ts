import Stripe from 'stripe';
import config from '../../config';

// Use stable API version and add error handling
if (!config.stripe.secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-08-27.basil', // Use the correct API version for your Stripe library
});
