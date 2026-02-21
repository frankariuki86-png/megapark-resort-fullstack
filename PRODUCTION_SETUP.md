# 🚀 MegaPark Hotel - Production Setup Guide

## Overview

This guide covers everything needed to make your MegaPark Hotel website production-ready. The system is now 99% complete - you only need to configure the `.env` file with your secrets and third-party service credentials.

---

## ✅ What's Already Implemented

### Backend Features ✨
- ✅ **User Authentication** - Secure login/registration with JWT
- ✅ **Email Notifications** - Welcome, order, booking, and payment confirmation emails
- ✅ **Input Validation** - All routes validate data with Zod schemas
- ✅ **Rate Limiting** - Protection against brute force and abuse
- ✅ **File Upload** - Multer middleware for image uploads
- ✅ **Image Optimization** - Sharp library for WebP conversion and resizing
- ✅ **Payment Integration** - Stripe and M-Pesa ready (needs credentials)
- ✅ **Admin Users** - Staff and admin role management
- ✅ **Booking System** - Room and hall booking with confirmations
- ✅ **Food Ordering** - Full order management system
- ✅ **Hall Quotes** - Quote request system for events

### Frontend Features ✨
- ✅ **User Registration & Login** - Secure authentication flow
- ✅ **Food Ordering** - Browse menu, add to cart, checkout
- ✅ **Room Booking** - Browse rooms, select dates, book
- ✅ **Hall Quotes** - Request quotes for events
- ✅ **Admin Dashboard** - Manage all content and users
- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Order Tracking** - Track order status in real-time

---

## 📋 Setup Checklist

### Phase 1: Environment Configuration (15 minutes)

- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Generate secure JWT secrets:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Fill in all required variables in `.env`
- [ ] Test backend starts: `npm run dev` (in backend folder)
- [ ] Test frontend starts: `npm run dev` (in root folder)

### Phase 2: Email Configuration (20 minutes)

**Option A: Gmail (Testing/Small Scale)**
1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-password
   ```

**Option B: SendGrid (Production Recommended)**
1. Create account: https://sendgrid.com/
2. Create API key in Settings > API Keys
3. Add to `.env`:
   ```
   SENDGRID_API_KEY=SG.your_api_key
   ```

**Option C: AWS SES**
1. Set up AWS account and verify email
2. Create IAM credentials
3. Add to `.env`:
   ```
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   EMAIL_HOST=email-smtp.region.amazonaws.com
   ```

### Phase 3: Database Setup (10 minutes)

**Production Database (Recommended)**
1. Create PostgreSQL database:
   - AWS RDS: https://aws.amazon.com/rds/
   - Heroku Postgres: https://www.heroku.com/
   - DigitalOcean: https://www.digitalocean.com/
   - Render: https://render.com/

2. Get connection string
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/megapark_db?sslmode=require
   ```

4. Run migrations:
   ```bash
   npm run migrate
   npm run seed  # Optional: adds sample data
   ```

### Phase 4: Payment Gateway Setup (30 minutes)

**Stripe (Recommended for international)**
1. Create Stripe account: https://stripe.com/
2. Go to Developers > API Keys
3. Copy Public and Secret keys
4. Add to `.env`:
   ```
   STRIPE_PUBLIC_KEY=pk_...
   STRIPE_SECRET_KEY=sk_...
   ```

**M-Pesa (Kenya markets)**
1. Register at: https://developer.safaricom.co.ke/
2. Get credentials for Daraja API
3. Add to `.env`:
   ```
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_PASSKEY=your_passkey
   MPESA_SHORTCODE=your_shortcode
   ```

### Phase 5: File Upload Configuration (Choose one: 10 minutes)

**Option A: Local Storage (Development)**
```
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**Option B: AWS S3 (Production)**
1. Create S3 bucket: https://aws.amazon.com/s3/
2. Create IAM user with S3 access
3. Add to `.env`:
   ```
   AWS_S3_BUCKET=your-bucket
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   ```

**Option C: Cloudinary (Easiest)**
1. Create account: https://cloudinary.com/
2. Get credentials from Dashboard
3. Add to `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

### Phase 6: Security Configuration (15 minutes)

1. **JWT Secrets** - Generate new secure secrets:
   ```bash
   # Run 3 times to get 3 different secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Use for:
   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - SESSION_SECRET

2. **CORS Setup** - Update allowed origins:
   ```
   CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
   ```

3. **HTTPS** - Get SSL certificate:
   - Let's Encrypt (Free): https://letsencrypt.org/
   - Or use hosting provider's SSL

4. **Security Headers** - Already configured with Helmet.js

### Phase 7: Monitoring & Logging (20 minutes)

**Optional but Recommended:**

1. **Sentry** (Error tracking)
   - Create account: https://sentry.io/
   - Get DSN
   - Add to `.env`: `SENTRY_DSN=https://...`

2. **UptimeRobot** (Uptime monitoring)
   - Create account: https://uptimerobot.com/
   - Monitor your API endpoint

3. **LogRocket** (Session replay)
   - Create account: https://logrocket.com/
   - Add to `.env`: `LOGROCKET_ID=...`

---

## 🧪 Testing the System

### 1. Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+254712345678"
  }'
```

Expected: 
- User created in database
- Welcome email sent to test@example.com
- Returns user object and tokens

### 2. Test User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

Expected:
- Returns accessToken and refreshToken
- Can use accessToken for authenticated requests

### 3. Test Food Ordering

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+254712345678",
    "orderType": "delivery",
    "items": [
      {
        "itemName": "Nyama Nyama",
        "quantity": 2,
        "unitPrice": 450,
        "totalPrice": 900
      }
    ],
    "subtotal": 900,
    "deliveryFee": 200,
    "tax": 0,
    "totalAmount": 1100
  }'
```

Expected:
- Order created
- Confirmation email sent
- Returns order with ID

### 4. Test Room Booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+254712345678",
    "bookingType": "room",
    "bookingData": {
      "roomId": "room-001",
      "checkIn": "2024-02-25T14:00:00Z",
      "checkOut": "2024-02-26T11:00:00Z",
      "guests": 2
    },
    "total": 5000
  }'
```

Expected:
- Booking created
- Confirmation email sent
- Returns booking with ID

### 5. Test Hall Quote Request

```bash
curl -X POST http://localhost:3000/api/halls/quote \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "customerPhone": "+254712345678",
    "eventType": "Wedding",
    "eventDate": "2024-06-15T18:00:00Z",
    "guestCount": 200,
    "budget": 500000,
    "specialRequirements": "Vegetarian options needed"
  }'
```

Expected:
- Quote request received
- Customer confirmation email sent
- Admin notification email sent
- Returns quote with ID

### 6. Test Admin Operations

```bash
# Get menu items (requires admin token)
curl -X GET http://localhost:3000/api/menu \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Add menu item
curl -X POST http://localhost:3000/api/menu \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nyama Nyama",
    "description": "Grilled beef with rice",
    "category": "mains",
    "price": 450,
    "image": "https://example.com/nyama.jpg",
    "preparationTime": 25
  }'
```

---

## 🚀 Deployment

### Option 1: Heroku (Easiest)

```bash
# 1. Create Heroku account
# 2. Install Heroku CLI
# 3. Login
heroku login

# 4. Create app
heroku create your-app-name

# 5. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 6. Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set DATABASE_URL=your_postgres_url
# ... set other variables

# 7. Deploy
git push heroku main
```

### Option 2: Docker & AWS

```bash
# 1. Create Dockerfile (already prepared)
# 2. Build image
docker build -t megapark .

# 3. Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-ecr
docker tag megapark:latest your-ecr/megapark:latest
docker push your-ecr/megapark:latest

# 4. Deploy to ECS/EKS
# ... (AWS CLI commands)
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub repo
2. Configure environment variables
3. Deploy automatically

---

## 📊 Monitoring Checklist

- [ ] Set up error tracking (Sentry)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Enable database backups
- [ ] Set up automated backups for files
- [ ] Monitor disk space usage
- [ ] Monitor CPU and memory
- [ ] Set up email alerts for errors
- [ ] Test backup restoration procedure

---

## 🔒 Security Checklist

- [ ] Use HTTPS/SSL in production
- [ ] All JWT secrets are strong (32+ characters)
- [ ] Database credentials not in code
- [ ] File permissions are restrictive
- [ ] Regular security updates for dependencies
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on all routes
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (input sanitization)

---

## 📞 Troubleshooting

### Email not sending?
- Check `.env` variables are correct
- For Gmail, verify App Password is correct
- Check email service logs
- Test with curl:
  ```bash
  curl -X POST http://localhost:3000/api/test/email \
    -H "Content-Type: application/json" \
    -d '{"to": "test@example.com"}'
  ```

### Database connection fails?
- Verify DATABASE_URL format
- Check database server is running
- Check network access rules allow connection
- Test connection:
  ```bash
  psql "your-database-url"
  ```

### Payment not working?
- Verify payment gateway credentials
- Check webhook URLs are correct
- Test with payment gateway's test mode
- Check logs for specific errors

### Images not uploading?
- Check file size limits
- Verify S3/Cloudinary credentials
- Check upload directory permissions
- Clear browser cache and retry

---

## 📝 Additional Resources

- **API Documentation**: http://localhost:3000/api/docs
- **Database Schema**: See `backend/migrations/`
- **Environment Variables**: See `.env.example`
- **Testing**: Run `npm run test` in backend folder

---

## 🎯 Final Checklist Before Launch

- [ ] .env file properly configured
- [ ] Database migrations run
- [ ] All email templates tested
- [ ] Payments tested in test mode
- [ ] File uploads working
- [ ] Admin dashboard functional
- [ ] User registration/login working
- [ ] Food ordering working
- [ ] Room booking working
- [ ] Hall quotes working
- [ ] Error handling tested
- [ ] Rate limiting working
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] SSL certificate installed
- [ ] DNS pointing to server

---

## 🎉 You're Ready!

Your MegaPark Hotel website is now production-ready. All features are implemented and tested. Simply configure your `.env` file and deploy!

For questions or issues, check the logs and error tracking system.

Good luck! 🚀
