# Google OAuth2 Setup Guide for MegaPark Hotel

## Overview
This guide explains how to set up Google Sign-In for your MegaPark Hotel system. Users can now log in and register using their Google accounts.

## Prerequisites
- Google account with Google Cloud Console access
- Your MegaPark application deployed (or running locally)
- Frontend and Backend servers running

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Create Project" and name it "MegaPark Hotel"
4. Wait for project creation to complete

---

## Step 2: Enable Google+ API

1. In the Cloud Console search bar, search for "Google+ API"
2. Click on "Google+ API" and click "Enable"
3. Wait for it to be enabled

---

## Step 3: Create OAuth 2.0 Credentials

1. Go to **Credentials** in the left sidebar
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. You'll see "Create OAuth client ID" dialog
   - If prompted to set up OAuth consent screen first:
     - Choose "External" user type
     - Click "Create"
     - Fill in app name: "MegaPark Hotel"
     - Add your email as support contact
     - Scroll to bottom and click "Save and Continue"

4. Back on the Credentials page, click **Create Credentials** → **OAuth 2.0 Client ID** again
5. Select **Web application**
6. Name it: "MegaPark Hotel Frontend"
7. Under **Authorized redirect URIs**, add your domains:
   ```
   http://localhost:3000
   http://localhost:5173
   https://yourdomain.com
   ```
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

---

## Step 4: Configure Backend (.env)

In `backend/.env`, add your Google credentials:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

Example:
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456abc123def456
```

---

## Step 5: Configure Frontend (.env)

In the root `.env` file, add:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Example:
```env
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

---

## Step 6: Install Dependencies

In the backend folder, install the Google auth library:

```bash
cd backend
npm install google-auth-library
npm install
```

---

## Step 7: Restart Servers

Restart both backend and frontend servers:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

---

## Step 8: Test Google Sign-In

1. Open your app at `http://localhost:5173`
2. Click **Login** button
3. You should see a "Sign in with Google" button
4. Click it and follow Google's sign-in flow
5. After signing in, you'll be logged into MegaPark Hotel

---

## Features

✅ **Auto Account Creation**
- New Google users automatically get an account created
- Profile data (name, email) synced from Google

✅ **Instant Login**
- No need to enter password for Google users
- Seamless authentication flow

✅ **Welcome Email**
- New Google sign-in users receive a welcome email
- Contains tips for using MegaPark

✅ **Password-Optional**
- Google users don't need a password
- Traditional email/password login still available

✅ **Account Linking**
- Users with existing accounts can link Google later
- Single email = one account

---

## Troubleshooting

### "Invalid Client ID" Error
- ✓ Check that your Client ID is correctly pasted in both `.env` files
- ✓ Verify there are no extra spaces or line breaks

### Google Button Not Appearing
- ✓ Check that Google Sign-In script loaded: Open DevTools (F12) → Network tab
- ✓ Make sure you're using the correct Client ID
- ✓ Ensure `VITE_GOOGLE_CLIENT_ID` is in your frontend `.env`

### "Origin mismatch" Error
- ✓ Add your domain to "Authorized redirect URIs" in Google Cloud Console
- ✓ For localhost: add `http://localhost:5173` and `http://localhost:3000`
- ✓ Wait 5 minutes for changes to take effect

### Sign-In Fails After Login
- ✓ Check browser console for errors (F12 → Console tab)
- ✓ Verify backend response at: Network tab → /api/auth/google
- ✓ Make sure email configuration is correct (optional but recommended)

### Token Verification Error
- ✓ Check that backend has correct `GOOGLE_CLIENT_ID` in `.env`
- ✓ Restart backend server after changing `.env`

---

## Production Deployment

### Update Authorized Redirect URIs

In Google Cloud Console:
1. Go to Credentials
2. Click your OAuth 2.0 Client ID
3. Add your production domains:
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   https://api.yourdomain.com
   ```

### Update Environment Variables

On your production server:

```env
# backend/.env
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret

# Frontend .env (if served separately)
VITE_GOOGLE_CLIENT_ID=your-production-client-id
```

### Create a New Production OAuth Client (Recommended)

For extra security, create separate OAuth credentials for production:
1. In Google Cloud Console, create a new OAuth 2.0 Client ID
2. Name it "MegaPark Hotel Production"
3. Add only your production domains
4. Use this Client ID and Secret in production

---

## How It Works

1. **User clicks "Sign in with Google"**
   - Google's JavaScript SDK opens sign-in dialog
   - User enters their Google credentials

2. **Google returns an ID Token**
   - Token is sent to your backend (`/api/auth/google`)
   - Backend verifies the token with Google

3. **Backend validates token**
   - Uses Google Auth Library to verify signature
   - Extracts user information (email, name, picture)

4. **User account is created/found**
   - If new user: creates account automatically
   - If existing user: logs them in
   - Sends welcome email to new users

5. **JWT tokens issued**
   - Backend returns JWT access & refresh tokens
   - Frontend stores tokens in localStorage
   - User is fully logged in

---

## Security Features

🔒 **Token Verification**
- Tokens verified with Google's public key
- Expired tokens rejected
- Token signature validation

🔒 **No Password Stored for Google Users**
- Google handles authentication
- Your database never sees passwords

🔒 **Email Verified**
- Google only returns verified emails
- Safe to use email for password reset, etc.

🔒 **CORS Protected**
- Only your registered domains can authenticate
- Prevents token theft from unauthorized sites

---

## API Reference

### Google Sign-In Endpoint

**Endpoint:** `POST /api/auth/google`

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "google-1234567890",
    "email": "user@gmail.com",
    "name": "John Doe",
    "role": "customer",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid Google token"
}
```

---

## Next Steps

✅ Google OAuth is now configured
✅ Users can sign in with Google
✅ New users automatically get accounts

### What to do next:
1. Test Google sign-in thoroughly
2. Customize welcome email (backend/services/googleAuthService.js)
3. Add OAuth to deployment checklist
4. Monitor OAuth logins in your analytics

---

Need help? Check:
- Backend logs: `backend/logs/error.log`
- Browser console: F12 → Console
- Network tab: F12 → Network → /api/auth/google

Happy coding! 🚀
