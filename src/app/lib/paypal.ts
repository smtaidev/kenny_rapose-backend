import config from '../../config';

// PayPal configuration
const clientId = config.paypal.clientId;
const clientSecret = config.paypal.clientSecret;
const environment = config.paypal.mode === 'live' ? 'live' : 'sandbox';
const baseUrl = environment === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

if (!clientId || !clientSecret) {
  throw new Error('PayPal credentials are not configured');
}

// Get PayPal access token
export const getPayPalAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal token request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};

// Create PayPal order
export const createPayPalOrderAPI = async (orderData: any): Promise<any> => {
  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'PayPal-Request-Id': orderData.custom_id || 'order-' + Date.now(),
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`PayPal order creation failed: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};

export { baseUrl, environment };