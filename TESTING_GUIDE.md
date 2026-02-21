# 🧪 MegaPark Hotel - Complete Testing Guide

## Overview

This guide provides step-by-step instructions to test all features of your MegaPark Hotel website. Follow these tests to ensure everything is working before production launch.

---

## Prerequisites

1. Backend running: `npm run dev` (in backend folder)
2. Frontend running: `npm run dev` (in project root)
3. Database configured and running
4. Email service configured (SMTP or SendGrid)
5. Postman or cURL for API testing (optional)

---

## Test 1: User Registration

### Step 1.1: Frontend Registration
1. Navigate to http://localhost:5173 (or your frontend URL)
2. Click on "Sign Up" / "Register"
3. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Phone: `+254712345678`
   - Password: `SecurePass123` (must have uppercase, lowercase, number)
4. Click Submit
5. Should see success message: "Account created successfully"

### Step 1.2: Verify Email Sent
1. Check your email inbox for welcome email from MegaPark
2. Email should contain:
   - Welcome message
   - Available features (ordering, booking, quotes)
   - How to proceed
3. **Status**: ✅ PASS if email received, ❌ FAIL if not

### Step 1.3: API Test (cURL)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "SecurePass123",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+254712345679"
  }'
```

Expected Response:
```json
{
  "ok": true,
  "message": "Account created successfully. A welcome email has been sent.",
  "user": {
    "id": "user-123456789",
    "email": "jane.smith@example.com",
    "name": "Jane Smith"
  }
}
```

---

## Test 2: User Login

### Step 2.1: Frontend Login
1. Navigate to login page
2. Fill in credentials:
   - Email: `john.doe@example.com`
   - Password: `SecurePass123`
3. Click Login
4. Should see success and redirect to dashboard
5. Verify user name appears in header

### Step 2.2: API Test (cURL)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

Expected Response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user-123456789",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

### Step 2.3: Invalid Password Test
1. Try login with wrong password
2. Should see error: "Invalid credentials"
3. Account should NOT be locked (optional: test rate limiting)

---

## Test 3: Food Ordering Flow

### Step 3.1: Browse Menu
1. Login as user from Test 2
2. Navigate to "Food" / "Menu" section
3. Verify menu items display:
   - Item names
   - Descriptions
   - Prices
   - Images

### Step 3.2: Add Items to Cart
1. Click "+ Add to Cart" on multiple items
2. Select quantity (e.g., 2 units)
3. Verify cart updates with:
   - Item count badge on cart icon
   - Item totals calculated correctly
   - Subtotal updates

### Step 3.3: Checkout
1. Click on Shopping Cart
2. Verify cart displays:
   - All added items
   - Quantities
   - Individual item totals
   - Subtotal, tax, total fee
   - Grand total
3. Click "Proceed to Checkout"

### Step 3.4: Delivery Details
1. Select delivery type:
   - Delivery
   - Dine-in
   - Pickup
2. If delivery, fill in address:
   - Full Name
   - Phone
   - County/City
   - Street Address
   - Building (optional)
   - Special instructions (optional)

### Step 3.5: Payment Method
1. Select payment method:
   - Credit Card (Stripe fallback)
   - M-Pesa (if configured)
   - On Delivery
2. Fill required fields for selected method
3. Click "Place Order"

### Step 3.6: Order Confirmation
1. Should see confirmation page with:
   - Order ID (e.g., ORDER-123456)
   - Order items
   - Total amount
   - Estimated delivery time
2. Should receive confirmation email containing:
   - Order ID
   - Items ordered
   - Total price
   - Delivery details
3. Status should be "pending" → "confirmed" → "preparing"

### Step 3.7: Order Tracking (Optional)
1. Go to "My Orders" / "Order History"
2. Click on the order from Test 3.6
3. Verify you can see:
   - Order status
   - Items in order
   - Order timeline
   - Support contact info

### Step 3.8: API Test

```bash
# Create order API test
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com",
    "customerPhone": "+254712345678",
    "orderType": "delivery",
    "items": [
      {
        "itemName": "Nyama Nyama",
        "quantity": 2,
        "unitPrice": 450,
        "totalPrice": 900
      },
      {
        "itemName": "Ugali",
        "quantity": 1,
        "unitPrice": 150,
        "totalPrice": 150
      }
    ],
    "subtotal": 1050,
    "deliveryFee": 200,
    "tax": 0,
    "totalAmount": 1250,
    "deliveryAddress": {
      "fullName": "John Doe",
      "phone": "+254712345678",
      "county": "Nairobi",
      "town": "Westlands",
      "street": "Mpesi Lane",
      "building": "ABC Plaza"
    }
  }'
```

---

## Test 4: Room Booking Flow

### Step 4.1: Browse Rooms
1. Navigate to "Rooms" / "Accommodation"
2. Verify room listings display:
   - Room numbers
   - Room types (Standard, Deluxe, Suite)
   - Prices per night
   - Images
   - Amenities
3. Verify rooms show availability status

### Step 4.2: Select Room & Dates
1. Click on a room to view details
2. Select check-in date (use date picker)
3. Select check-out date
4. Verify price calculates correctly:
   - Number of nights × price per night
5. Display total cost
6. Click "Book Now"

### Step 4.3: Booking Details
1. Verify pre-filled with logged-in user info:
   - Name
   - Email
   - Phone
2. Confirm/update if needed
3. Add any special requests
4. Click "Continue"

### Step 4.4: Payment (Before Booking)
1. Select payment method
2. Fill payment details
3. Click "Confirm Booking"

### Step 4.5: Booking Confirmation
1. Should see confirmation page with:
   - Booking ID (e.g., BOOK-123456)
   - Room details
   - Check-in/out dates
   - Number of nights
   - Total cost
   - Confirmation number

2. Should receive confirmation email with:
   - Booking ID
   - Room details
   - Check-in time (e.g., 2 PM)
   - Check-out time (e.g., 11 AM)
   - Total payment
   - Cancellation policy

### Step 4.6: Booking Management
1. Go to "My Bookings"
2. Click on booking from Step 4.5
3. Verify you can see:
   - Booking details
   - Room info
   - Payment status
   - Cancellation option (if applicable)

### Step 4.7: API Test

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com",
    "customerPhone": "+254712345678",
    "bookingType": "room",
    "bookingData": {
      "roomId": "room-002",
      "checkIn": "2024-03-01T14:00:00Z",
      "checkOut": "2024-03-03T11:00:00Z",
      "guests": 2,
      "specialRequests": "High floor preferred"
    },
    "total": 10000,
    "paymentStatus": "pending",
    "status": "booked"
  }'
```

---

## Test 5: Hall Quote Request

### Step 5.1: Navigation
1. Navigate to "Events" / "Hall Quote" / "Book Hall"
2. Should see hall quote request form

### Step 5.2: Fill Quote Request
1. Fill out form:
   - **Event Type**: Wedding (or other event)
   - **Event Date**: Select future date
   - **Expected Guests**: 150
   - **Budget**: 500000 (optional)
   - **Special Requirements**: Vegetarian menu, outdoor setup, etc.

2. Form should have:
   - Your name (pre-filled if logged in)
   - Your email
   - Your phone
   - Drop-down for hall selection (if available)

### Step 5.3: Submit Request
1. Click "Request Quote"
2. Should see success message: "Quote request received"
3. Should see message about response timeline (e.g., "24 hours" or "1-2 business days")

### Step 5.4: Confirmation Emails
**Customer Email:**
1. Should receive confirmation email from MegaPark
2. Email should contain:
   - Request acknowledgement
   - Request details (event type, date, guests)
   - Sales team contact

**Admin/Sales Email:**
1. Admin/sales team should receive notification email
2. Email should contain:
   - Quote ID
   - Customer details
   - Event details
   - Request details

### Step 5.5: API Test

```bash
curl -X POST http://localhost:3000/api/halls/quote \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Smith",
    "customerEmail": "jane.smith@example.com",
    "customerPhone": "+254712345679",
    "eventType": "Wedding Reception",
    "eventDate": "2024-06-15T18:00:00Z",
    "guestCount": 250,
    "specialRequirements": "Please arrange for outdoor DJ and lighting",
    "budget": 750000
  }'
```

---

## Test 6: Admin Dashboard

### Step 6.1: Login as Admin
1. Navigate to Admin section (e.g., /admin or header link)
2. Login with admin credentials:
   - Email: `admin@megapark.com`
   - Password: (use admin password from database)
3. Should see admin dashboard

### Step 6.2: Menu Management
1. Click "Menu" or "🍽️ Menu" tab
2. Click "+ Add Item"
3. Fill in:
   - Name: `Sambusas`
   - Category: `Appetizers`
   - Price: `150`
   - Prep Time: `10`
   - Image: (upload or URL)
4. Click "Add Item"
5. Verify item appears in table
6. Click "Edit" on newly created item
7. Change price to `160`
8. Click "Update"
9. Verify price updated in table
10. Click "Delete" on item
11. Confirm deletion
12. Item should disappear from table

### Step 6.3: Room Management
1. Click "Rooms" or "🛏️ Rooms" tab
2. Click "+ Add Room"
3. Fill in:
   - Room Number: `105`
   - Name: `Deluxe Double`
   - Type: `Deluxe`
   - Price Per Night: `8500`
   - Capacity: `2`
   - Amenities: Add AC, WiFi, TV
4. Click "Add Room"
5. Verify room appears in table
6. Edit and update room details
7. Verify changes reflect in table

### Step 6.4: Hall Management
1. Click "Halls" or "🏛️ Halls" tab
2. Click "+ Add Hall"
3. Fill in:
   - Name: `Grand Ballroom`
   - Type: `Banquet`
   - Capacity: `500`
   - Area: `800` (sq meters)
   - Base Price: `150000`
4. Click "Add Hall"
5. Edit and delete hall
6. Verify operations work correctly

### Step 6.5: Staff Management
1. Click "Staff" or "👥 Staff" tab
2. Click "+ Add Staff"
3. Fill in:
   - Name: `Alice Johnson`
   - Email: `alice@megapark.com`
   - Password: `SecureStaff123`
   - Role: `Staff`
4. Click "Add Staff"
5. New staff should appear in table
6. Click "Active/Inactive" button to toggle status
7. Click "Edit" to modify staff details (change role to Admin)
8. Click "Delete" to remove staff
9. Verify all CRUD operations work

### Step 6.6: Orders Management
1. Click "Food Orders" tab (if available in admin)
2. View all orders from Test 3
3. Verify order details display
4. Check if you can update order status

### Step 6.7: Bookings Management
1. Click "Bookings" tab (if available in admin)
2. View all bookings from Test 4
3. Verify booking details display
4. Check if you can update booking status

---

## Test 7: Email System

### Step 7.1: Welcome Email (from Test 1)
- [ ] Received after registration
- [ ] Contains welcome message
- [ ] Contains available features
- [ ] Contains support contact
- [ ] Properly formatted HTML
- [ ] Images load correctly

### Step 7.2: Order Confirmation Email (from Test 3)
- [ ] Received after order placement
- [ ] Contains order ID
- [ ] Lists all items
- [ ] Shows total price
- [ ] Shows delivery details
- [ ] Contains estimated delivery time

### Step 7.3: Booking Confirmation Email (from Test 4)
- [ ] Received after booking
- [ ] Contains booking ID
- [ ] Shows room details
- [ ] Shows check-in/out dates
- [ ] Shows total payment
- [ ] Contains cancellation policy
- [ ] Contains support contact

### Step 7.4: Quote Request Email (from Test 5)
**Customer Email:**
- [ ] Received after quote request
- [ ] Contains acknowledgement
- [ ] Shows event details
- [ ] Contains sales team contact

**Admin Email:**
- [ ] Received by admin
- [ ] Contains quote ID
- [ ] Shows customer details
- [ ] Shows event details
- [ ] Includes special requirements

---

## Test 8: Input Validation

### Step 8.1: Registration Validation
Test with invalid inputs:
- [ ] Email without @ sign → Error
- [ ] Password < 8 characters → Error
- [ ] Password without uppercase → Error
- [ ] Password without number → Error
- [ ] Missing required fields → Error
- [ ] Duplicate email → Error (409 Conflict)

### Step 8.2: Order Validation
Test with invalid order data:
- [ ] Missing customer name → Error
- [ ] Invalid email → Error
- [ ] Zero items → Error
- [ ] Negative quantities → Error
- [ ] Invalid total amount → Error

### Step 8.3: Booking Validation
Test with invalid booking data:
- [ ] Check-out before check-in → Error
- [ ] Invalid date format → Error
- [ ] Zero guests → Error
- [ ] Missing required fields → Error

---

## Test 9: Authentication & Authorization

### Step 9.1: Token Validation
- [ ] Valid token allows API requests
- [ ] Invalid token returns 401 Unauthorized
- [ ] Expired token returns 401 Unauthorized
- [ ] Token refresh works correctly

### Step 9.2: Role-Based Access
- [ ] Admin can access admin dashboard
- [ ] Regular user CANNOT access admin dashboard
- [ ] Admin can only modify own content (or all, depending on implementation)
- [ ] Regular user cannot create menu items

---

## Test 10: Error Handling

### Step 10.1: Network Errors
- [ ] Handle connection timeout gracefully
- [ ] Show error message to user
- [ ] Allow retry after network recovery

### Step 10.2: Database Errors
- [ ] Duplicate email → Clear message
- [ ] Invalid data → Validation error
- [ ] Database down → Graceful error message
- [ ] 500 error → User-friendly error message

### Step 10.3: Payment Errors
- [ ] Insufficient funds → Clear payment error
- [ ] Invalid payment method → Error message
- [ ] Payment timeout → Retry option

---

## Test 11: Rate Limiting

### Step 11.1: Login Rate Limiting
1. Try logging in with wrong password 5+ times
2. Account should be temporarily locked or rate limited
3. Should show "Too many attempts, try again later"
4. Wait 15 minutes and try again (or as configured)
5. Should work normally

### Step 11.2: API Rate Limiting
1. Make 30+ requests per minute to API
2. Should receive 429 Too Many Requests
3. After rate limit window expires, requests should work

---

## Test 12: Responsive Design

### Step 12.1: Mobile (Smallest)
1. Open frontend on phone (or use DevTools device mode: 375px)
2. Verify:
   - [ ] Menu toggles properly
   - [ ] Forms stack vertically
   - [ ] Images resize properly
   - [ ] Buttons are touchable (>44px)
   - [ ] Text is readable
   - [ ] No horizontal scrolling

### Step 12.2: Tablet
1. Set viewport to 768px width
2. Verify:
   - [ ] Layout looks good
   - [ ] Navigation is usable
   - [ ] Tables scroll horizontally if needed
   - [ ] Forms are properly aligned

### Step 12.3: Desktop
1. Open on desktop (1920px width)
2. Verify:
   - [ ] All content visible
   - [ ] Proper spacing
   - [ ] Images not too large
   - [ ] Good use of horizontal space

---

## Test 13: Admin File Uploads (Optional)

### Step 13.1: Menu Item Image Upload
1. In admin, create/edit menu item
2. Upload image file (JPG, PNG)
3. Image should:
   - [ ] Display in preview
   - [ ] Save to storage
   - [ ] Load correctly in menu item view
   - [ ] Optimize for web (WebP, compressed)

### Step 13.2: Room Image Upload
1. In admin, create/edit room
2. Upload room images
3. Images should:
   - [ ] Display in preview gallery
   - [ ] Save to storage
   - [ ] Load in room booking page

---

## Final Checklist

- [ ] All 13 test suites completed
- [ ] All emails received and formatted correctly
- [ ] No error messages in browser console
- [ ] No error messages in backend logs
- [ ] Database contains all created records
- [ ] Admin dashboard fully functional
- [ ] User flows work end-to-end
- [ ] Mobile responsive verified
- [ ] Rate limiting working
- [ ] Input validation working
- [ ] Email templates professional
- [ ] Performance acceptable (< 3s page load)
- [ ] No security warnings
- [ ] All API endpoints functioning

---

## 🎉 Ready for Production!

If all tests pass, your MegaPark Hotel system is ready for production! 

**Next steps:**
1. Deploy to production server
2. Update DNS records
3. Set up SSL certificate
4. Monitor logs and errors
5. Announce launch to customers

Good luck! 🚀
