# Authentication & Validation Setup

## Overview
Backend now includes:
1. **JWT Authentication** - Secure token-based auth for protected endpoints
2. **Zod Input Validation** - Schema validation for all API requests
3. **Password Hashing** - Bcrypt password storage (plaintext never stored)
4. **Protected Routes** - Menu/Orders CRUD protected by JWT middleware

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

This installs:
- `jsonwebtoken` - JWT token generation/verification
- `zod` - Input validation schemas
- `bcrypt` - Password hashing

### 2. Environment Setup
Create/update `backend/.env`:
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/megapark
JWT_SECRET=your-secret-key-here
JWT_EXPIRES=24h
LOG_LEVEL=info
```

**Default JWT_SECRET fallback**: `dev-secret-key` (dev only)

### 3. Start Backend
```bash
npm run dev
```

### 4. Test Login Endpoint
```bash
# Login with default credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@megapark.com","password":"admin123"}'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": "admin-001",
#     "email": "admin@megapark.com",
#     "name": "Admin User",
#     "role": "admin"
#   }
# }
```

### 5. Use Token for Protected Routes
```bash
# Get menu (requires token)
curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  http://localhost:3000/api/menu

# Create menu item (protected)
curl -X POST http://localhost:3000/api/menu \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pizza","category":"mains","price":12.99}'
```

## Authentication Flow

### Frontend (src/api/mockApi.js)
1. Call `loginAdmin(email, password)` to get JWT token
2. Token automatically stored in localStorage as `__megapark_jwt__`
3. All subsequent API calls automatically include `Authorization: Bearer <token>` header
4. Token sent to all protected endpoints (menu/orders management)

### Backend (backend/middleware/authenticate.js)
1. Extract Bearer token from `Authorization` header
2. Verify signature against `JWT_SECRET`
3. Attach user info (`id`, `email`, `role`) to `req.user`
4. Pass to next middleware (route handler)

### Protected Routes
- **GET /api/menu** - Public (list items)
- **POST /api/menu** - Protected (create item)
- **PUT /api/menu/:id** - Protected (update item)
- **DELETE /api/menu/:id** - Protected (delete item)
- **GET /api/orders** - Protected (list orders)
- **POST /api/orders** - Public (create order)
- **PUT /api/orders/:id** - Protected (update order)

## Validation Schemas (Zod)

### MenuItemCreateSchema
```javascript
{
  name: string (min 1, max 100),
  description?: string (max 500),
  category: string,
  price: number (min 0),
  image?: string (url),
  preparationTime?: number (min 0)
}
```

### OrderCreateSchema
```javascript
{
  customerName: string,
  customerEmail?: string (email),
  customerPhone?: string,
  items: array of objects (required),
  totalPrice: number (min 0),
  status?: string ("pending" | "confirmed" | "completed"),
  paymentStatus?: string ("pending" | "completed"),
  paymentMethod?: string
}
```

### LoginSchema
```javascript
{
  email: string (email format),
  password: string (min 1)
}
```

## Default User

Email: `admin@megapark.com`
Password: `admin123`

> **Note**: These are demo credentials. In production, replace with real user database and secure password management.

## Token Details

### JWT Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": "admin-001",
    "email": "admin@megapark.com",
    "name": "Admin User",
    "role": "admin",
    "iat": 1234567890,
    "exp": 1234654290  // Expires in 24 hours (default)
  },
  "signature": "HMAC-SHA256(...)"
}
```

### Token Expiry
- Default: 24 hours
- Configurable via `JWT_EXPIRES` env variable
- Formats: `24h`, `7d`, `1y`, `60` (seconds)

## Error Responses

### 401 Unauthorized - Invalid Credentials
```json
{ "error": "Invalid credentials" }
```

### 401 Unauthorized - Missing/Invalid Token
```json
{ "error": "Unauthorized" }
```

### 400 Bad Request - Validation Error
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["email"],
      "message": "Expected string, received number"
    }
  ]
}
```

## Frontend Integration

### Login Example
```javascript
import mockApi from './api/mockApi';

// 1. Login to get token
const { token, user } = await mockApi.loginAdmin('admin@megapark.com', 'admin123');
console.log('Logged in as:', user.name); // "Admin User"

// 2. Token automatically stored in localStorage
// 3. All API calls now include Authorization header automatically

// 4. Fetch menu
const menu = await mockApi.fetchMenuItems(); // Token sent automatically

// 5. Create new item
const newItem = await mockApi.createMenuItem({
  name: 'Burger',
  category: 'mains',
  price: 9.99
}); // Token sent automatically
```

## Adding New Users (Production)

When connecting to real Postgres DB:

1. Create users table (already in migrations):
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

2. Replace mock users array in `routes/auth.js` with DB lookup:
```javascript
const { rows } = await pgClient.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
const user = rows[0];
```

3. Hash passwords before storage:
```javascript
const hash = await bcrypt.hash(password, 10);
await pgClient.query(
  'INSERT INTO users (email, password_hash, ...) VALUES ($1, $2, ...)',
  [email, hash]
);
```

## Security Best Practices

✅ **Implemented:**
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens signed with secret key
- Protected routes require valid token
- Input validation with Zod
- CORS enabled for frontend origin

⚠️ **TODO (for production):**
- Implement refresh tokens for token rotation
- Add rate limiting on /api/auth/login
- Add logout endpoint (invalidate tokens)
- Implement password reset flow
- Add email verification
- Add role-based access control (RBAC)
- Use HTTPS in production
- Rotate JWT_SECRET periodically
- Store users in encrypted Postgres table
- Implement multi-factor authentication (MFA)

## Troubleshooting

### "Unauthorized" error on protected routes
- Check token is present in localStorage (`__megapark_jwt__`)
- Call `loginAdmin()` first to get token
- Verify token hasn't expired (24h default)

### "Validation error" on POST/PUT
- Check request body matches schema exactly
- Use console.log to inspect request before sending
- Review validation error details in response

### Backend connection fails
- Ensure backend running: `npm run dev` in `backend/` folder
- Check port 3000 is not in use
- Verify `BACKEND_URL` in frontend points to correct server

### Token expired
- Tokens expire after 24 hours
- User must login again
- TODO: Implement refresh tokens for seamless re-auth

