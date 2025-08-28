# 🚀 Stripe AI Credit Payment Setup Guide for Kenny Rappose

## Overview
This guide will help you implement Stripe one-time payments for AI credits in your Kenny Rappose project. The system uses Stripe Checkout Sessions for a secure, hosted payment experience.

## 🎯 Features Implemented

- **Stripe Checkout Sessions** for one-time payments
- **AI Credit Package Management** with pricing
- **Payment Tracking** and history
- **Webhook Handling** for payment confirmation
- **User Credit Management** automatic credit addition
- **Secure Payment Processing** with Stripe

## 📋 Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Node.js & pnpm**: Ensure you have the latest LTS versions
3. **PostgreSQL Database**: Your existing database setup

## 🔧 Step 1: Install Dependencies

```bash
cd kenny-rappose
pnpm install
```

## 🔑 Step 2: Configure Stripe

### 2.1 Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
4. Add to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2.2 Create AI Credit Products in Stripe
1. Go to **Products** → **Add Product**
2. Create products for each AI credit package:

#### Starter Package
- **Name**: `Starter AI Credits`
- **Description**: `50 AI Credits for Breeze AI`
- **Price**: `$9.99` (one-time)

#### Pro Package
- **Name**: `Pro AI Credits`
- **Description**: `200 AI Credits for Breeze AI`
- **Price**: `$29.99` (one-time)

#### Enterprise Package
- **Name**: `Enterprise AI Credits`
- **Description**: `500 AI Credits for Breeze AI`
- **Price**: `$59.99` (one-time)

## 🌐 Step 3: Set Up Webhook

### 3.1 Create Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Configure:
   - **Endpoint URL**: `https://your-domain.com/api/v1/payments/webhook`
   - **Events to send**: Select these events:
     - `checkout.session.completed`
     - `checkout.session.expired`
4. **Add endpoint**

### 3.2 Get Webhook Secret
1. After creating the webhook, click on it
2. Go to **Signing secret**
3. Click **Reveal** and copy the secret
4. Add to your `.env` file (already done in step 2.1)

## 🗄️ Step 4: Database Setup

### 4.1 Push Database Schema
```bash
pnpm db:push
```

### 4.2 Verify New Tables
The following new tables should be created:
- `payments` - Payment tracking
- `credit_purchases` - AI credit purchase records

## 🧪 Step 5: Test Your Setup

### 5.1 Test API Endpoints

#### Create Checkout Session
```bash
POST http://localhost:5000/api/v1/payments/create-checkout-session
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "packageId": "PACKAGE_ID_HERE",
  "successUrl": "http://localhost:3000/payment/success",
  "cancelUrl": "http://localhost:3000/payment/cancel"
}
```

#### Get Payment History
```bash
GET http://localhost:5000/api/v1/payments/history
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Get Payment Details
```bash
GET http://localhost:5000/api/v1/payments/PAYMENT_ID
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 5.2 Test with Stripe Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Expiry: Any future date (e.g., `12/25`)
CVC: Any 3 digits (e.g., `123`)

## 🔄 Step 6: Frontend Integration

### 6.1 Redirect to Stripe Checkout
```javascript
// After creating checkout session
const response = await fetch('/api/v1/payments/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    packageId: 'package-id',
    successUrl: 'https://yourapp.com/success',
    cancelUrl: 'https://yourapp.com/cancel'
  })
});

const { sessionUrl } = await response.json();

// Redirect to Stripe Checkout
window.location.href = sessionUrl;
```

### 6.2 Handle Success/Cancel
```javascript
// Success page
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

if (sessionId) {
  // Payment successful - show success message
  // Credits will be automatically added via webhook
}
```

## 📊 Step 7: Monitor Payments

### 7.1 Stripe Dashboard
- Monitor payments in real-time
- View customer information
- Handle disputes and refunds

### 7.2 Your Application
- Track payment status in your database
- Monitor credit purchases
- Handle failed payments

## 🚨 Important Security Notes

1. **Never expose your secret key** in frontend code
2. **Always verify webhook signatures** (implemented automatically)
3. **Use HTTPS** in production for webhook endpoints
4. **Implement proper error handling** for failed payments
5. **Monitor webhook failures** and implement retry logic

## 🔍 Troubleshooting

### Common Issues

#### Webhook Not Receiving Events
- Check webhook endpoint URL is accessible
- Verify webhook secret is correct
- Check server logs for errors

#### Payment Not Completing
- Verify Stripe keys are correct
- Check package ID exists and is active
- Ensure user has valid authentication

#### Credits Not Adding
- Check webhook is working
- Verify database connections
- Check payment status in Stripe dashboard

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📈 Next Steps

1. **Implement Payment Analytics** - Track conversion rates
2. **Add Payment Methods** - Support for more payment options
3. **Implement Refunds** - Handle customer refunds
4. **Add Subscription Plans** - Recurring credit packages
5. **Implement Coupons** - Discount codes for credits

## 🆘 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in your dashboard
- **Project Issues**: Check your project repository

## ✅ Checklist

- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Webhook endpoint configured
- [ ] Environment variables set
- [ ] Database schema updated
- [ ] API endpoints tested
- [ ] Frontend integration completed
- [ ] Payment flow tested
- [ ] Webhook handling verified
- [ ] Error handling implemented

---

**🎉 Congratulations!** You now have a fully functional Stripe payment system for AI credits in your Kenny Rappose project.
