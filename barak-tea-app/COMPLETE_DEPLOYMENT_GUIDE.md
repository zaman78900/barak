# BARAK Tea - Complete Deployment Guide

## ✅ PRE-DEPLOYMENT STATUS
- ✅ Frontend built successfully (460KB production bundle)
- ✅ Backend configured and ready
- ✅ Database schema prepared
- ✅ All environment variables set up
- ✅ API endpoints configured

---

## 📋 STEP-BY-STEP DEPLOYMENT INSTRUCTIONS

### **PHASE 1: Preparation (5 minutes)**

#### Step 1.1: Create GitHub Repository
```bash
1. Go to https://github.com/new
2. Create repository: "barak-tea"
3. Choose: Public (for Vercel free tier)
4. Click "Create repository"
```

#### Step 1.2: Push Your Code to GitHub
```bash
# In VS Code Terminal (in workspace root):
cd "d:\barak web 2\barak-tea-app"

git init
git add .
git commit -m "Initial BARAK Tea deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/barak-tea.git
git push -u origin main
```

---

### **PHASE 2: Frontend Deployment (Vercel) - 5 minutes**

#### Step 2.1: Connect Vercel to GitHub
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Click "Import Git Repository"
4. Search for "barak-tea" repository
5. Click "Import"

#### Step 2.2: Configure Vercel Settings
**Framework & Build Settings:**
- Framework Preset: Select **Vite**
- Build Command: Auto-detected (leave as is)
- Output Directory: `frontend/dist`
- Install Command: `cd frontend && npm install`

**Environment Variables:**
Add these in Vercel Settings > Environment Variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://api.barak.tea/api` (or your Render backend URL) |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_xxxxx` (from your Stripe dashboard) |

#### Step 2.3: Deploy
- Click "Deploy"
- Wait 3-5 minutes for build
- You'll get a URL: `https://barak-tea.vercel.app`

#### Step 2.4: Add Custom Domain (Optional)
1. Go to Settings > Domains
2. Add domain (e.g., `barak.tea`)
3. Update DNS records (Vercel will show you how)
4. Wait for SSL certificate (auto-generated)

---

### **PHASE 3: Backend Deployment (Render) - 5 minutes**

#### Step 3.1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize the connection

#### Step 3.2: Create Backend Service
1. Go to Dashboard
2. Click "New +" > "Web Service"
3. Select your `barak-tea` GitHub repository
4. Configure:
   - **Name**: `barak-tea-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `node backend/server.js`

#### Step 3.3: Add Environment Variables
In the Render dashboard, add these variables:

```
SUPABASE_URL=https://YOUR_SUPABASE_URL.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

JWT_SECRET=your-secure-key-min-32-characters

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLIC_KEY=pk_live_xxxxx

TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+1234567890

PORT=5000
NODE_ENV=production
API_URL=https://barak-tea-api.onrender.com
FRONTEND_URL=https://barak.tea  (or your Vercel domain)
```

#### Step 3.4: Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- You'll get a URL: `https://barak-tea-api.onrender.com`

#### Step 3.5: Update Vercel Environment Variable
Go back to Vercel:
1. Settings > Environment Variables
2. Update `VITE_API_URL` to your Render backend URL:
   ```
   https://barak-tea-api.onrender.com/api
   ```
3. Redeploy frontend (click "Deployments" > latest > "Redeploy")

---

### **PHASE 4: Database Setup (Supabase) - 5 minutes**

#### Step 4.1: Verify Supabase is Ready
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run the migration script (if not already done):
   - Copy [BARAK_DATABASE_SCHEMA.sql](../BARAK_DATABASE_SCHEMA.sql)
   - Paste into SQL Editor
   - Click "Run"
5. Verify tables are created in **Database** > **Tables**

#### Step 4.2: Get Supabase Credentials
In Supabase Dashboard:
1. Go to **Settings** > **API**
2. Copy:
   - `SUPABASE_URL` → Project URL
   - `SUPABASE_ANON_KEY` → anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role secret

3. Add these to Render environment variables (already done in Step 3.3)

---

### **PHASE 5: Testing & Verification - 5 minutes**

#### Step 5.1: Test Frontend
1. Visit your Vercel domain: `https://barak-tea.vercel.app`
2. Check DevTools > Network tab
3. Verify images load correctly (should be fast, cached by Vercel)
4. Navigate through pages

#### Step 5.2: Test Backend API
Open a new terminal:
```bash
# Test health endpoint
curl https://barak-tea-api.onrender.com/health

# Expected response:
# {"status":"ok","timestamp":"2026-04-23T10:00:00.000Z"}
```

#### Step 5.3: Test Authentication
1. On frontend, try to **Sign Up**
2. Fill in form and submit
3. Check backend logs in Render dashboard
4. Verify user created in Supabase > Auth or database

#### Step 5.4: Test Products
1. Go to **Shop** page
2. Verify products load from database
3. Product images should display

---

### **PHASE 6: Post-Deployment Setup - 10 minutes**

#### Step 6.1: Setup Email Service (Gmail)
1. Go to https://myaccount.google.com/apppasswords
2. Generate app password for "Mail"
3. Copy the 16-character password
4. Update Render env variable: `SMTP_PASSWORD=xxxxxxxxxxxxxxxx`
5. Redeploy: Render > "Manual Deploy"

#### Step 6.2: Setup Stripe (Optional)
1. Create account: https://stripe.com
2. Go to Dashboard > API Keys
3. Copy `sk_live_xxxxx` and `pk_live_xxxxx`
4. Update Render env variables
5. Redeploy

#### Step 6.3: Setup Twilio WhatsApp (Optional)
1. Create account: https://twilio.com
2. Go to Messaging > Send a WhatsApp message
3. Get ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER
4. Update Render env variables
5. Redeploy

#### Step 6.4: Enable Custom Domain (Optional)
1. Go to Render > Settings > Custom Domains
2. Add domain (e.g., `api.barak.tea`)
3. Update DNS CNAME record
4. Wait for SSL (auto-generated)

---

## 🔍 TROUBLESHOOTING

### "Frontend builds but shows 404"
**Solution:** 
- Check Vercel `_redirects` or `vercel.json` (already configured)
- Redeploy frontend
- Clear browser cache (Ctrl+Shift+Delete)

### "API calls fail / CORS error"
**Solution:**
- Check Render backend is running (status green)
- Verify `FRONTEND_URL` env var matches your Vercel domain
- Check backend logs in Render dashboard
- Redeploy backend

### "Database connection timeout"
**Solution:**
- Check Supabase status: https://status.supabase.com
- Verify credentials in Render env variables
- Check database has tables (run schema SQL if missing)

### "Images not loading"
**Solution:**
- Verify product images exist in Supabase Storage
- Check image URLs in database
- Verify CORS headers from Supabase

---

## 📊 MONITORING

**Frontend (Vercel):**
- Dashboard > Analytics
- Monitor: page views, performance, errors

**Backend (Render):**
- Dashboard > Logs
- Monitor: requests, errors (Winston logger shows all)

**Database (Supabase):**
- Dashboard > Database > Logs
- Monitor: slow queries, errors

---

## 🚀 NEXT STEPS

After successful deployment:

1. ✅ Test all features (authentication, orders, payments)
2. ✅ Set up monitoring & alerts
3. ✅ Configure backup strategy
4. ✅ Plan marketing launch
5. ✅ Monitor performance metrics

---

## 📞 SUPPORT

If you encounter issues:
1. Check **TROUBLESHOOTING.md** in project root
2. Check logs in Render/Vercel dashboards  
3. Verify all environment variables are set
4. Clear browser cache and redeploy

---

**Deployment Time: ~30 minutes**
**Status: Ready for Production ✅**
