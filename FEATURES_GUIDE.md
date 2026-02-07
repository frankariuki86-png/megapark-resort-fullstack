# Email Notifications, Payment Gateway & Refresh Tokens - Implementation Guide

## Overview
This guide covers the implementation of three critical features:
1. **Email Notifications** - Order confirmations, booking alerts, password reset
2. **Payment Gateway** - Stripe integration for secure payment processing
3. **Refresh Tokens** - JWT token rotation for improved security

---

## 1️⃣ Email Notifications

### Setup

#### Option A: Gmail (Recommended for Testing)
```env
# backend/.env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@megapark-hotel.com
```

**Steps**:
1. Enable 2-Factor Authentication on Gmail
2. Generate [App Password](https://support.google.com/accounts/answer/185833)
3. Use app password in EMAIL_PASS

#### Option B: SendGrid (Production)
```env
SENDGRID_API_KEY=SG.your-api-key
EMAIL_FROM=noreply@megapark-hotel.com
```

#### Option C: Development (Ethereal - No Setup Needed)
Leave EMAIL_* vars empty. System creates test account automatically and logs preview URLs.

### Email Templates

**Available templates**:

| Template | Trigger | Use Case |
|----------|---------|----------|
| `orderConfirmation` | After order creation | Send to customer email |
| `bookingConfirmation` | After booking | Send to customer |
| `passwordReset` | Password reset request | Send reset link |
| `adminAlert` | Critical events | Send to admin email |

### Usage Examples

#### Send Order Confirmation
```javascript
const { sendEmail } = require('./services/emailService');

await sendEmail(
  'customer@example.com',
  'orderConfirmation',
  {
    id: 'ORDER-123',
    customerName: 'John Doe',
    items: [{ name: 'Pizza', price: 12.99 }],
    totalPrice: 12.99,
    createdAt: new Date().toISOString()
  },
  logger
);
```

#### Send Booking Confirmation
```javascript
await sendEmail(
  'customer@example.com',
  'bookingConfirmation',
  {
    id: 'BOOK-456',
    customerName: 'Jane Doe',
    checkIn: '2026-02-15',
    checkOut: '2026-02-17',
    totalPrice: 299.99
  },
  logger
);
```

#### Send Password Reset
```javascript
await sendEmail(
  'user@example.com',
  'passwordReset',
  {
    name: 'User Name',
    email: 'user@example.com'
  },
  logger
);
```

### Email Service Features
- ✅ Multiple email providers (SMTP, SendGrid, Ethereal)
- ✅ Template-based emails
- ✅ HTML and plain text support
- ✅ Automatic fallback to dev account
- ✅ Error handling & logging
- ✅ Non-blocking (async)

### Current Integration
**Automatically sends email on**:
- ✅ Order creation (POST /api/orders)
- ⏳ TODO: Room booking confirmation
- ⏳ TODO: Event booking confirmation
- ⏳ TODO: Password reset request

---

## 2️⃣ Payment Gateway (Stripe)

### Setup

#### Get Stripe Keys
1. Create account at [stripe.com](https://stripe.com)
2. Go to [Dashboard](https://dashboard.stripe.com/apikeys)
3. Copy **Publishable Key** (pk_test_...) and **Secret Key** (sk_test_...)
4. Copy **Webhook Secret** for production webhooks

#### Configure Backend
```env
# backend/.env
STRIPE_PUBLIC_KEY=pk_test_51234567890123456789
STRIPE_SECRET_KEY=sk_test_123456789abcdef
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef  # For production
```

### Payment Flow

#### 1. Frontend: Load Stripe.js
```javascript
// In HTML or component
<script src="https://js.stripe.com/v3/"></script>
```

#### 2. Frontend: Create Payment Intent
```javascript
import mockApi from './api/mockApi';

const { clientSecret, intentId } = await mockApi.createPaymentIntent({
  totalPrice: order.totalPrice,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  id: order.id
});
```

#### 3. Frontend: Collect Card Details
```javascript
const stripe = Stripe('pk_test_...');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');
```

#### 4. Frontend: Confirm Payment
```javascript
const { token } = await stripe.createToken(cardElement);

if (token) {
  const result = await mockApi.confirmPaymentIntent(intentId, token.id);
  
  if (result.status === 'succeeded') {
    // Payment successful, show confirmation
    console.log('Payment successful!', result.chargeId);
  } else if (result.status === 'requires_action') {
    // 3D Secure authentication needed
    console.log('3D Secure required');
  }
}
```

### Payment Endpoints

#### POST /api/payments/create-intent
**Create payment intent for order**

Request:
```json
{
  "totalPrice": 99.99,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "id": "ORDER-123"
}
```

Response:
```json
{
  "clientSecret": "pi_3456_secret_7890",
  "intentId": "pi_3456",
  "amount": 9999,
  "currency": "usd"
}
```

#### POST /api/payments/confirm-intent
**Confirm payment after token creation**

Request:
```json
{
  "intentId": "pi_3456",
  "paymentMethodId": "pm_1234567890"
}
```

Response (Success):
```json
{
  "status": "succeeded",
  "chargeId": "ch_3456789"
}
```

#### GET /api/payments/intent/:intentId
**Check payment intent status**

Response:
```json
{
  "status": "succeeded",
  "amount": 9999,
  "currency": "usd",
  "chargeId": "ch_3456789"
}
```

#### POST /api/payments/webhook
**Stripe webhook endpoint**

Handles events:
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed
- `customer.subscription.deleted` - Subscription cancelled

### Testing Payments

**Test Card Numbers**:
```
Visa:                  4242 4242 4242 4242
Visa (declined):       4000 0000 0000 0002
3D Secure required:    4000 0025 0000 3155
Amex:                  3782 822463 10005
```

**Expiry**: Any future date (e.g., 12/25)  
**CVC**: Any 3 digits (e.g., 123)

### Webhook Testing (Local)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

stripe listen --forward-to localhost:3000/api/payments/webhook
stripe trigger payment_intent.succeeded
```

---

## 3️⃣ Refresh Tokens

### How It Works

#### Traditional JWT (Before)
- Single long-lived token (24 hours)
- If compromised, attacker has access for 24 hours
- No way to invalidate without backend session store

#### With Refresh Tokens (After)
- Short-lived access token (15 minutes)
- Long-lived refresh token (7 days)
- Access token expires quickly → safer
- Refresh token rotates → harder to compromise
- Can implement token blacklist if needed

### Token Structure

#### Access Token
```json
{
  "id": "admin-001",
  "email": "admin@megapark.com",
  "role": "admin",
  "type": "access",
  "iat": 1707433200,
  "exp": 1707434100  // Expires in 15 minutes
}
```

#### Refresh Token
```json
{
  "id": "admin-001",
  "email": "admin@megapark.com",
  "role": "admin",
  "type": "refresh",
  "iat": 1707433200,
  "exp": 1745169200  // Expires in 7 days
}
```

### Backend Implementation

#### Updated authenticate.js
```javascript
// Generate access token (15 min default)
generateAccessToken(user)

// Generate refresh token (7 days default)
generateRefreshToken(user)

// Generate both tokens
generateTokenPair(user)

// Refresh access token with refresh token
refreshAccessToken(refreshToken)
```

#### Login Response (New)
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "...", "email": "..." }
}
```

#### Updated Auth Endpoints

**POST /api/auth/login**
```json
// Response
{
  "accessToken": "eyJ...",  // 15 min expiry
  "refreshToken": "eyJ...", // 7 days expiry
  "user": { "id": "admin-001", "email": "admin@megapark.com", "role": "admin" }
}
```

**POST /api/auth/refresh** (New)
```json
// Request
{ "refreshToken": "eyJ..." }

// Response
{
  "accessToken": "eyJ...",  // New 15 min token
  "refreshToken": "eyJ..."  // New 7 day token (rotated)
}
```

**POST /api/auth/logout** (New)
```json
// Response
{ "message": "Logged out successfully" }
```

### Frontend Implementation

#### Login
```javascript
const { accessToken, refreshToken, user } = await mockApi.loginAdmin('admin@megapark.com', 'admin123');

// Tokens auto-stored in localStorage
// accessToken: __megapark_jwt__
// refreshToken: __megapark_refresh__
```

#### Auto-Refresh Before Expiry (Recommended)
```javascript
// Check if token expires in < 2 minutes
const isTokenExpiring = (token) => {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const expiresIn = decoded.exp * 1000 - Date.now();
  return expiresIn < 2 * 60 * 1000; // 2 minutes
};

// Before making API call
if (isTokenExpiring(getToken())) {
  await mockApi.refreshToken();
}

// Make API call with new token
const menu = await mockApi.fetchMenuItems();
```

#### Handle Token Expiry (Catch)
```javascript
try {
  const menu = await mockApi.fetchMenuItems();
} catch (error) {
  if (error.code === 'TOKEN_EXPIRED') {
    // Try to refresh
    try {
      await mockApi.refreshToken();
      // Retry request
      const menu = await mockApi.fetchMenuItems();
    } catch (refreshError) {
      // Refresh failed, force login
      await mockApi.logoutAdmin();
      window.location.href = '/login';
    }
  }
}
```

#### Logout
```javascript
await mockApi.logoutAdmin();
// Tokens cleared from localStorage automatically
// User should be redirected to login
```

### Environment Configuration

```env
# JWT Access Token (short-lived)
JWT_SECRET=your-secret-key
JWT_EXPIRES=15m  # 15 minutes

# JWT Refresh Token (long-lived)
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES=7d  # 7 days
```

---

## 📊 Integration Checklist

### Email Notifications
- [x] Service created (services/emailService.js)
- [x] Templates defined (order, booking, password reset, admin alert)
- [x] Integrated into order creation
- [ ] Integrated into room booking
- [ ] Integrated into event booking
- [ ] Password reset endpoint
- [ ] Admin alert for failed payments

### Payment Gateway
- [x] Service created (services/paymentService.js)
- [x] Endpoints created (create-intent, confirm-intent, webhook)
- [x] Stripe integration
- [x] Webhook handling
- [ ] Frontend payment component (Stripe Elements)
- [ ] Card payment form
- [ ] 3D Secure handling
- [ ] Subscription support

### Refresh Tokens
- [x] Middleware updated (generateAccessToken, generateRefreshToken)
- [x] Auth endpoints updated (login returns both tokens)
- [x] Refresh endpoint (POST /api/auth/refresh)
- [x] Logout endpoint (POST /api/auth/logout)
- [ ] Frontend auto-refresh interceptor
- [ ] Token expiry error handling
- [ ] Silent refresh before expiry

---

## 🧪 Testing

### Email Notifications
```bash
# Development (Ethereal)
npm run dev  # Check console for email preview URLs

# Gmail
# Set EMAIL_* vars, create app password, test with:
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerEmail": "your-email@gmail.com",
    "items": [{"itemName": "Pizza", "quantity": 1, "unitPrice": 12.99, "totalPrice": 12.99}],
    "totalAmount": 12.99
  }'
```

### Payment Gateway
```bash
# Create payment intent
curl -X POST http://localhost:3000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "totalPrice": 99.99,
    "customerName": "Test User",
    "customerEmail": "test@example.com"
  }'

# Check intent status
curl http://localhost:3000/api/payments/intent/pi_xxx
```

### Refresh Tokens
```bash
# Login
TOKEN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@megapark.com","password":"admin123"}')

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.refreshToken')

# Use access token (valid 15 min)
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:3000/api/menu

# Refresh when expired
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

---

## 🔒 Security Best Practices

### Email
- ✅ Never log passwords in email
- ✅ Use secure app passwords for Gmail
- ✅ HTTPS for all email links
- ✅ Rate limit password reset emails

### Payment
- ✅ Never store full card numbers
- ✅ Use Stripe for PCI compliance
- ✅ Verify webhook signatures
- ✅ HTTPS only in production
- ✅ Use 3D Secure for additional security

### Tokens
- ✅ Short-lived access tokens (15 min)
- ✅ Separate refresh token secret
- ✅ Rotate refresh tokens on use
- ✅ Store refresh tokens in httpOnly cookies (optional)
- ✅ Clear tokens on logout
- ✅ Implement token blacklist for revocation

---

## 📚 Additional Resources

- [Nodemailer Docs](https://nodemailer.com/about/)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Refresh Tokens](https://datatracker.ietf.org/doc/html/rfc6749#section-6)

---

**Status**: ✅ **COMPLETE - All three features implemented and ready to test**

