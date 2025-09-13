import { Client, Environment, ClientCredentialsAuthManager } from '@paypal/paypal-server-sdk';
import config from '../../config';

// PayPal client configuration
const clientId = config.paypal.clientId;
const clientSecret = config.paypal.clientSecret;
const environment = config.paypal.mode === 'live' ? Environment.Production : Environment.Sandbox;

if (!clientId || !clientSecret) {
  throw new Error('PayPal credentials are not configured');
}

// Create client first
const client = new Client({
  environment,
});

// Create auth manager with client
const authManager = new ClientCredentialsAuthManager({
  oAuthClientId: clientId,
  oAuthClientSecret: clientSecret,
}, client);

export const paypalClient = client;
