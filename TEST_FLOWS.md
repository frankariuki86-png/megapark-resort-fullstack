# Testing Checklist for Megapark Hotel Website

## Backend Status
- ✅ Backend running on http://localhost:3000
- ✅ Fixes applied:
  - Fixed syntax error in backend/validators/schemas.js (RoomCreateSchema)
  - Fixed syntax error in backend/services/emailService.js (hallQuoteRequest)

## Frontend Status
- ✅ Frontend running on http://localhost:5174/megapark-hotel/
- ✅ All dependencies installed

## Testing Plan

### 1. User Registration Flow
- [ ] Navigate to home page
- [ ] Click "Sign In" button (should open Auth Modal)
- [ ] Switch to "Create Account" tab
- [ ] Fill in registration form:
  - Email: test@example.com
  - Password: Test123456 (must have uppercase, lowercase, number)
  - First Name: John
  - Last Name: Doe
  - Phone: +254712345678
- [ ] Click "Create Account"
- [ ] Verify success message and modal closes
- [ ] Verify user is logged in (name appears in header)

### 2. User Login Flow
- [ ] Sign out (if currently signed in)
- [ ] Click "Sign In" button
- [ ] Enter email: test@example.com
- [ ] Enter password: Test123456
- [ ] Click "Login"
- [ ] Verify user is logged in

### 3. Admin Login Flow
- [ ] Navigate to /admin/login
- [ ] Enter email: admin@megapark.com
- [ ] Enter password: admin123
- [ ] Click "Login"
- [ ] Should be redirected to /admin/dashboard

### 4. Admin Dashboard
- [ ] Verify dashboard loads with all sections visible:
  - [ ] Menu Management
  - [ ] Room Management
  - [ ] Hall Management
  - [ ] Orders Management
  - [ ] Bookings Management
  - [ ] Admin Users Management
  - [ ] Staff Management

### 5. API Endpoints Test
- [ ] Test /api/auth/register - POST
- [ ] Test /api/auth/login - POST
- [ ] Test /api/auth/refresh - POST
- [ ] Test /api/menu - GET/POST
- [ ] Test /api/orders - GET/POST
- [ ] Test /api/bookings - GET/POST

## Status
- Backend: ✅ Running
- Frontend: ✅ Running
- Ready for Manual Testing

---

## Test Results

### User Registration
Test User: test.user@megapark.com
Status: [PENDING]

### User Login
Test User: test.user@megapark.com
Status: [PENDING]

### Admin Login
Admin: admin@megapark.com
Status: [PENDING]

### Dashboard Access
Status: [PENDING]
