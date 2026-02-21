# 🚀 Quick Start Guide - Testing Megapark Hotel Website

**Last Updated**: February 21, 2026

## ⚡ Running the Application

### Start Backend (if not running)
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

### Start Frontend (if not running)
```bash
cd ..  # back to megapark-hotel folder
npm run dev
# Frontend runs on http://localhost:5174/megapark-hotel/
```

---

## 🌐 Access the Website

### Main Website
👉 **http://localhost:5174/megapark-hotel/**

### Admin Dashboard
👉 **http://localhost:5174/megapark-hotel/admin/login**

---

## 📋 Test Scenarios

### Test 1: Create New User Account ✅

1. Open **http://localhost:5174/megapark-hotel/**
2. Click **"Sign In"** button in the top-right corner
3. Click **"Create Account"** tab
4. Fill in the form:
   ```
   Email:       testuser1@megapark.com
   Password:    MyPassword123 (must have uppercase, lowercase, number)
   First Name:  John
   Last Name:   Doe
   Phone:       +254712345678
   ```
5. Click **"Create Account"**
6. ✅ Account created! Modal closes and you're logged in
7. Check header - your name should appear

**Expected Results**:
- Successful registration message
- User logged in automatically
- Token stored in localStorage
- User name displayed in header

---

### Test 2: Login with Existing Account ✅

1. Open **http://localhost:5174/megapark-hotel/**
2. Click **"Sign In"** button
3. Login tab should be active by default
4. Enter credentials:
   ```
   Email:    testuser1@megapark.com
   Password: MyPassword123
   ```
5. Click **"Login"**
6. ✅ Logged in successfully
7. Check header - your name appears

**Expected Results**:
- User authenticated
- JWT tokens in localStorage
- Access to user features (Orders, Profile, etc.)

---

### Test 3: Admin Login & Dashboard ✅

1. Open **http://localhost:5174/megapark-hotel/admin/login**
2. Enter admin credentials:
   ```
   Email:    admin@megapark.com
   Password: admin123
   ```
3. Click **"Login"**
4. ✅ Redirected to Admin Dashboard
5. You should see:
   - Menu Management section
   - Room Management section
   - Hall Management section
   - Orders Management section
   - Bookings Management section

**Expected Results**:
- Admin authenticated
- Dashboard fully loaded
- All admin features accessible
- Admin data visible

---

### Test 4: Logout & Re-login

1. While logged in, click your username in header (User or Admin)
2. Click **"Logout"**
3. ✅ Logged out successfully
4. Sign In button appears again
5. Try to login again - verify it works

---

### Test 5: Password Validation

1. Try to create an account with weak password:
   ```
   Password: weak
   ```
2. ✅ Should show error: "Password must be at least 8 characters"

3. Try password without uppercase:
   ```
   Password: password123
   ```
4. ✅ Should show error: "must contain at least one uppercase letter"

5. Try password without number:
   ```
   Password: Password
   ```
6. ✅ Should show error: "must contain at least one number"

---

### Test 6: Duplicate Email Prevention

1. Try to register with same email twice:
   ```
   Email: testuser1@megapark.com (already used in Test 1)
   ```
2. ✅ Should show error: "Account already exists" (409 Conflict)

---

### Test 7: Invalid Login

1. Try to login with correct email but wrong password:
   ```
   Email:    testuser1@megapark.com
   Password: WrongPassword123
   ```
2. ✅ Should show error: "Invalid credentials"

3. Try to login with non-existent email:
   ```
   Email:    notexist@megapark.com
   Password: AnyPassword123
   ```
4. ✅ Should show error: "Invalid credentials"

---

## 🛠️ Troubleshooting

### Backend not running?
```bash
cd backend
npm install  # If dependencies missing
npm start
```
Check: http://localhost:3000 should respond

### Frontend not loading?
```bash
npm install  # If node_modules missing
npm run dev
```
Check: http://localhost:5174/megapark-hotel/ should load

### Port 3000 or 5174 already in use?
```bash
# Find process using port 3000 (Windows):
netstat -ano | findstr :3000

# Kill process:
taskkill /PID <PID> /F
```

### CORS errors?
Check that `.env` in backend has:
```
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### API not responding?
1. Check backend is running: `npm start` in backend folder
2. Check console for errors
3. Check network tab in browser DevTools
4. Ensure API_BASE in frontend points to `http://localhost:3000`

---

## 📊 What Gets Stored

### User Registration
- User data saved to `backend/data/users.json` (when no database configured)
- Or saved to Postgres database (if DATABASE_URL configured)

### User Session
- Access token stored in localStorage
- Refresh token stored in localStorage
- User data stored in React Context

### Admin Data
- Admin user stored in localStorage
- Sample data for menus, rooms, halls, etc. in memory

---

## 🔑 Test Credentials

### Admin Account (Pre-configured)
```
Email:    admin@megapark.com
Password: admin123
Role:     Admin
```

### Test User Accounts (Created during testing)
```
Email:    testuser1@megapark.com
Password: MyPassword123
Role:     Customer
```

---

## ✅ Verification Checklist

Use this checklist when testing:

- [ ] **Registration**: Can create new account
- [ ] **Validation**: Weak passwords rejected
- [ ] **Duplicate Check**: Same email blocked
- [ ] **User Login**: Can login with email/password
- [ ] **Admin Login**: Can login as admin
- [ ] **Dashboard**: Admin dashboard loads
- [ ] **Logout**: Can logout successfully
- [ ] **Tokens**: JWT tokens stored in localStorage
- [ ] **Protected Routes**: User features accessible when logged in
- [ ] **Error Handling**: Invalid credentials show error message

---

## 📞 Support

If you encounter issues:

1. Check the browser console (F12 → Console tab)
2. Check the backend terminal for error messages
3. Verify both services are running
4. Clear localStorage and try again: `localStorage.clear()`
5. Check network tab (F12 → Network) to see API calls

---

**Happy Testing! 🎉**
