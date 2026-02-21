# 🎯 MegaPark Hotel - 5 Minute Setup Guide

## Status: ✅ EVERYTHING IS COMPLETE!

Your website code is 100% ready. You just need to add configuration secrets.

---

## ⚡ Quick Start (Copy & Paste)

### 1. Generate JWT Secrets (Copy 3 long random strings)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Copy `.env.example` to `.env`
```bash
cd backend
cp .env.example .env
```

### 3. Edit `backend/.env` with these essentials:

```env
# ✅ Must Change These
PORT=3000
NODE_ENV=development
JWT_SECRET=<paste-1st-random-string-here>
JWT_REFRESH_SECRET=<paste-2nd-random-string-here>
SESSION_SECRET=<paste-3rd-random-string-here>

# Email Setup (Choose ONE option below)

# Option A: Gmail (Free, for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=noreply@megapark.com

# Option B: SendGrid (Free tier available)
# Comment out EMAIL_HOST above
# SENDGRID_API_KEY=SG.your_api_key

# Database (Optional: omit for JSON file storage)
DATABASE_URL=postgresql://user:password@localhost:5432/megapark

# CORS (For production, change to your domain)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Admin Contact
ADMIN_EMAIL=admin@megapark.com
ADMIN_PHONE=+254711768878
```

### 4. Install Backend Dependencies
```bash
cd backend
npm install
# Wait for Multer and Sharp to install (2-5 minutes)
```

### 5. Start Backend
```bash
npm run dev
# Should see: "Server running on http://localhost:3000"
```

### 6. Start Frontend (in another terminal)
```bash
# Go to project root
npm run dev
# Should see: "VITE v6.4.1 ready in X ms"
```

### 7. Test It!
- Frontend: http://localhost:5173
- API Docs: http://localhost:3000/api/docs
- Try creating an account and placing an order

---

## 📧 Email Setup Details

### Gmail (Recommended for Testing)
1. Enable 2FA on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Create App Password (generates 16 characters)
4. Copy to `EMAIL_PASS` in `.env`

### SendGrid (Recommended for Production)
1. Create account: https://sendgrid.com/ (free tier: 100 emails/day)
2. Go to Settings → API Keys
3. Create new API key
4. Copy to `SENDGRID_API_KEY` in `.env`
5. Comment out EMAIL_HOST line

### No Email (Development Only)
- Leave EMAIL_HOST empty
- Will use test email service (Ethereal)
- Emails logged to console

---

## 💾 Database Setup

### Option A: File-Based (Development - Default)
- Leave `DATABASE_URL` empty/commented
- Uses JSON files in `backend/data/`
- Perfect for testing
- NO external setup needed

### Option B: PostgreSQL (Production Recommended)
1. Install PostgreSQL locally or use managed service:
   - Local: https://www.postgresql.org/download/
   - Cloud: https://www.heroku.com/, https://render.com/, https://aws.amazon.com/rds/

2. Create database: `megapark_db`

3. Get connection string:
   ```
   postgresql://user:password@host:port/megapark_db?sslmode=require
   ```

4. Add to `.env`:
   ```
   DATABASE_URL=postgresql://...
   ```

5. Run migrations (optional):
   ```bash
   npm run migrate
   npm run seed  # Adds sample data
   ```

---

## 🧪 Quick Test Checklist

- [ ] Frontend loads at http://localhost:5173
- [ ] API Docs show at http://localhost:3000/api/docs
- [ ] Can register new user
- [ ] Welcome email received (check spam folder)
- [ ] Can login
- [ ] Can add food items to cart
- [ ] Can book a room
- [ ] Can request hall quote
- [ ] Can access admin dashboard

---

## 🚨 Common Issues & Fixes

### "Email not sending"
→ Check EMAIL_USER and EMAIL_PASS are correct
→ For Gmail, use App Password (not regular password)
→ Check spam folder

### "Database connection failed"
→ Leave DATABASE_URL empty to use JSON files
→ Or verify PostgreSQL is running
→ Check connection string format

### "Port 3000 already in use"
→ Change PORT=3001 in `.env`
→ Or kill existing process: `lsof -ti:3000 | xargs kill -9`

### "VITE build fails"
→ Delete `node_modules` and `package-lock.json`
→ Run `npm install` again

### "npm install takes forever"
→ Your internet might be slow
→ Try: `npm install --no-optional`

---

## 📦 What's Already Done

✅ **Backend**
- User authentication
- Email notifications
- Input validation
- Rate limiting
- File uploads
- Payment ready (Stripe/M-Pesa)
- Admin dashboard API
- All CRUD operations

✅ **Frontend**
- User registration/login
- Food ordering
- Room booking
- Hall quotes
- Admin dashboard
- Responsive design
- Real-time updates

✅ **Documentation**
- Production setup guide
- Testing guide
- API documentation
- Admin guide

---

## 🎯 Your Task (Just 3 Things)

1. **Fill `.env` file** with your secrets (5 minutes)
2. **Run `npm install`** in backend (3 minutes)
3. **Start backend & frontend** with `npm run dev` (1 minute)

That's it! Everything else is done. 🎉

---

## 📞 Next Steps

1. **Test Everything** - Follow TESTING_GUIDE.md
2. **Setup Production** - Follow PRODUCTION_SETUP.md
3. **Deploy** - Use any Node.js hosting (Heroku, Render, DigitalOcean, AWS)
4. **Launch** - Tell the world! 🚀

---

## 💡 Pro Tips

- Save `.env` in `.gitignore` (don't commit secrets!)
- Regenerate JWT secrets for production
- Use strong database password
- Enable HTTPS in production
- Set up email backups for reliability
- Monitor error logs with Sentry (free tier)

---

## 🎊 You're Ready!

Your website is complete and production-ready. You just need:
- ✅ 3 random secret strings
- ✅ Email service credentials
- ✅ (Optional) Database URL

Then you can:
- Test locally ✓
- Deploy to production ✓
- Start serving customers ✓

Go setup that `.env` file and start building your business! 🚀
