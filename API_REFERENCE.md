# 📡 Complete API Endpoints Reference

## Authentication Endpoints

### POST /api/auth/login
**Login with email and password**

**Request**:
```json
{
  "email": "admin@megapark.com",
  "password": "admin123"
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-001",
    "email": "admin@megapark.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Errors**:
- 400: Validation error
- 401: Invalid credentials
- 500: Server error

---

### POST /api/auth/refresh
**Refresh access token using refresh token**

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Missing refresh token
- 401: Invalid refresh token
- 500: Server error

---

### POST /api/auth/logout
**Logout (clear tokens client-side)**

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

---

## Menu Endpoints

### GET /api/menu
**List all menu items (public)**

**Response** (200):
```json
[
  {
    "id": "menu-1",
    "name": "Margherita Pizza",
    "description": "Fresh mozzarella",
    "category": "mains",
    "price": 14.99,
    "image": "https://example.com/pizza.jpg",
    "availability": true,
    "preparationTime": 15,
    "createdAt": "2026-02-08T10:00:00Z"
  }
]
```

---

### POST /api/menu
**Create menu item (admin only - requires JWT)**

**Auth**: `Authorization: Bearer <accessToken>`

**Request**:
```json
{
  "name": "Pepperoni Pizza",
  "description": "Classic pepperoni",
  "category": "mains",
  "price": 16.99,
  "image": "https://example.com/pepperoni.jpg",
  "preparationTime": 20
}
```

**Response** (201):
```json
{
  "id": "menu-2",
  "name": "Pepperoni Pizza",
  "category": "mains",
  "price": 16.99,
  "createdAt": "2026-02-08T10:05:00Z"
}
```

**Errors**:
- 400: Validation error
- 401: Unauthorized (invalid token)
- 500: Server error

---

### PUT /api/menu/:id
**Update menu item (admin only - requires JWT)**

**Auth**: `Authorization: Bearer <accessToken>`

**Request**:
```json
{
  "price": 15.99,
  "availability": false
}
```

**Response** (200):
```json
{
  "id": "menu-1",
  "name": "Margherita Pizza",
  "price": 15.99,
  "availability": false,
  "updatedAt": "2026-02-08T10:10:00Z"
}
```

---

### DELETE /api/menu/:id
**Delete menu item (admin only - requires JWT)**

**Auth**: `Authorization: Bearer <accessToken>`

**Response** (204): No content

**Errors**:
- 401: Unauthorized
- 404: Menu item not found
- 500: Server error

---

## Order Endpoints

### GET /api/orders
**List all orders (admin only - requires JWT)**

**Auth**: `Authorization: Bearer <accessToken>`

**Response** (200):
```json
[
  {
    "id": "ORDER-1707433200000",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "items": [
      { "itemName": "Pizza", "quantity": 2, "unitPrice": 14.99 }
    ],
    "totalPrice": 29.98,
    "status": "confirmed",
    "paymentStatus": "paid",
    "createdAt": "2026-02-08T10:00:00Z"
  }
]
```

---

### POST /api/orders
**Create order (public - no auth required)**

**Request**:
```json
{
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "customerPhone": "+1234567890",
  "orderType": "delivery",
  "deliveryAddress": "123 Main St, City",
  "items": [
    {
      "itemName": "Margherita Pizza",
      "quantity": 1,
      "unitPrice": 14.99,
      "totalPrice": 14.99
    }
  ],
  "subtotal": 14.99,
  "deliveryFee": 5.00,
  "tax": 1.60,
  "totalAmount": 21.59
}
```

**Response** (201):
```json
{
  "id": "ORDER-1707433300000",
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "items": [...],
  "totalPrice": 21.59,
  "status": "pending",
  "paymentStatus": "pending",
  "createdAt": "2026-02-08T10:05:00Z"
}
```

**Note**: Order confirmation email automatically sent to customerEmail if provided.

**Errors**:
- 400: Validation error
- 500: Server error

---

### PUT /api/orders/:id
**Update order (admin only - requires JWT)**

**Auth**: `Authorization: Bearer <accessToken>`

**Request**:
```json
{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

**Response** (200):
```json
{
  "id": "ORDER-1707433300000",
  "status": "confirmed",
  "paymentStatus": "paid",
  "updatedAt": "2026-02-08T10:10:00Z"
}
```

---

## Payment Endpoints

### POST /api/payments/create-intent
**Create Stripe payment intent (public)**

**Request**:
```json
{
  "totalPrice": 99.99,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "id": "ORDER-123"
}
```

**Response** (200):
```json
{
  "clientSecret": "pi_3456_secret_7890",
  "intentId": "pi_3456",
  "amount": 9999,
  "currency": "usd"
}
```

**Note**: Use `clientSecret` with Stripe.js on frontend for card input.

---

### POST /api/payments/confirm-intent
**Confirm payment with payment method (public)**

**Request**:
```json
{
  "intentId": "pi_3456",
  "paymentMethodId": "pm_1234567890"
}
```

**Response** (200 - Success):
```json
{
  "status": "succeeded",
  "chargeId": "ch_3456789"
}
```

**Response** (200 - 3D Secure Required):
```json
{
  "status": "requires_action",
  "clientSecret": "pi_3456_secret_7890"
}
```

**Errors**:
- 400: Missing intentId or paymentMethodId
- 400: Payment failed
- 500: Server error

---

### GET /api/payments/intent/:intentId
**Get payment intent status (public)**

**Response** (200):
```json
{
  "status": "succeeded",
  "amount": 9999,
  "currency": "usd",
  "chargeId": "ch_3456789"
}
```

**Errors**:
- 404: Intent not found
- 500: Server error

---

### POST /api/payments/webhook
**Stripe webhook endpoint (requires signature verification)**

**Headers**:
```
Stripe-Signature: t=timestamp,v1=signature
```

**Body**: Raw Stripe event JSON

**Events Handled**:
- `payment_intent.succeeded` - Payment successful, send email
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Charge refunded
- `customer.subscription.deleted` - Subscription cancelled

**Response** (200):
```json
{
  "received": true,
  "handled": true
}
```

---

## Health Check Endpoint

### GET /api/health
**Server health check (public)**

**Response** (200):
```json
{
  "ok": true
}
```

---

## Request Headers

### For Protected Routes
All protected endpoints require this header:

```
Authorization: Bearer <accessToken>
```

### Standard Headers
```
Content-Type: application/json
```

### For Stripe Webhook
```
Stripe-Signature: t=<timestamp>,v1=<signature>
```

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request successful | GET menu |
| 201 | Created - New resource created | POST order |
| 204 | No Content - Successful delete | DELETE menu item |
| 400 | Bad Request - Validation error | Invalid email |
| 401 | Unauthorized - Invalid/missing token | Token expired |
| 404 | Not Found - Resource doesn't exist | Menu item not found |
| 500 | Server Error - Internal error | Database connection failed |

---

## Error Response Format

### Standard Error
```json
{
  "error": "error_message"
}
```

### Validation Error
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "path": ["email"],
      "message": "Expected string, received number"
    }
  ]
}
```

### Token Expired
```json
{
  "error": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

---

## Rate Limiting (Recommended)

Currently: No rate limiting

Recommended limits:
- `/api/auth/login` - 5 requests per 15 minutes
- `/api/auth/refresh` - 10 requests per minute
- `/api/payments/*` - 20 requests per minute
- Other endpoints - 100 requests per minute

---

## Example Complete Flow

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@megapark.com","password":"admin123"}'

# Returns: accessToken, refreshToken
```

### 2. Create Menu Item
```bash
TOKEN="<accessToken from login>"

curl -X POST http://localhost:3000/api/menu \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza",
    "category": "mains",
    "price": 12.99
  }'
```

### 3. Create Order (Customer)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John",
    "customerEmail": "john@example.com",
    "items": [{"itemName": "Pizza", "quantity": 1, "unitPrice": 12.99, "totalPrice": 12.99}],
    "totalAmount": 12.99
  }'

# Returns: order with ID
# Email sent automatically to john@example.com
```

### 4. Create Payment
```bash
ORDER_ID="<order ID from step 3>"

curl -X POST http://localhost:3000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "totalPrice": 12.99,
    "customerName": "John",
    "customerEmail": "john@example.com",
    "id": "'$ORDER_ID'"
  }'

# Returns: clientSecret, intentId
# Use clientSecret with Stripe.js for card input
```

### 5. Confirm Payment
```bash
INTENT_ID="<intentId from step 4>"

curl -X POST http://localhost:3000/api/payments/confirm-intent \
  -H "Content-Type: application/json" \
  -d '{
    "intentId": "'$INTENT_ID'",
    "paymentMethodId": "pm_test_123"
  }'

# Returns: status "succeeded" or "requires_action"
```

### 6. Refresh Token (When Access Token Expires)
```bash
REFRESH_TOKEN="<refreshToken from login>"

curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"'$REFRESH_TOKEN'"}'

# Returns: new accessToken, new refreshToken
```

---

**Total Endpoints**: 13  
**Public**: 6 (health, list menu, create order, create payment, confirm payment, payment status)  
**Protected**: 7 (login, refresh, logout, create menu, update menu, delete menu, list orders, update order)

All endpoints fully documented and production-ready! ✅

