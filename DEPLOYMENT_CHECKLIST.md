# 🚀 BARAK Tea - Full Stack Deployment Guide

## Current Status
- ✅ Frontend: Deployed to Vercel (https://barak-theta.vercel.app)
- ❌ Backend: Not deployed yet - **NEEDS SETUP**
- ⚠️ Admin features broken because backend API not accessible

---

## Quick Fix Summary (3 Steps)

### STEP 1️⃣: Deploy Backend to Render (5 minutes)

See detailed guide: `barak-tea-app/BACKEND_DEPLOYMENT_RENDER.md`

**Quick checklist:**
- [ ] Push code to GitHub
- [ ] Create Render account (free)
- [ ] Deploy `barak-tea` repo to Render
- [ ] Add environment variables (Supabase, JWT, etc.)
- [ ] Copy the Render backend URL (e.g., `https://barak-tea-api-xxxxx.onrender.com`)

### STEP 2️⃣: Update Frontend API Configuration (2 minutes)

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com → Project Settings
2. Environment Variables
3. Update `VITE_API_URL` to your Render backend:
   ```
   VITE_API_URL=https://barak-tea-api-xxxxx.onrender.com/api
   ```

**Option B: Via Command Line**
```bash
# Edit the file
# barak-tea-app/frontend/.env.production
# Change: VITE_API_URL=https://barak-tea-api.onrender.com/api
# To:     VITE_API_URL=https://your-actual-render-url.onrender.com/api

git add .
git commit -m "Update API URL to production backend"
git push
```

### STEP 3️⃣: Test Admin Features (2 minutes)

1. Go to https://barak-theta.vercel.app/admin
2. Try adding a product
3. ✅ Done! Product should appear on main site

---

## What's Already Done

✅ Root `package.json` - Build scripts configured
✅ Root `vercel.json` - Frontend deployment config ready
✅ Frontend `.env.production` - API URL template ready
✅ Backend `.env.production` - Environment template created
✅ Deployment guides - Step-by-step instructions ready

---

## File Structure for Deployment

```
barak-tea-app/
├── frontend/
│   ├── .env.production       ← Update VITE_API_URL here
│   ├── src/
│   ├── package.json
│   └── dist/                 ← Built here, deployed to Vercel
│
├── backend/
│   ├── .env.production       ← Configure for Render
│   ├── server.js
│   └── package.json
│
├── Procfile                  ← Tells Render how to run backend
├── BACKEND_DEPLOYMENT_RENDER.md  ← Detailed backend setup
└── DEPLOYMENT.md             ← General deployment info
```

---

## Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://[your-render-url]/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Backend (Render)
```
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[key]
SUPABASE_SERVICE_ROLE_KEY=[key]
JWT_SECRET=[32+ char secret]
FRONTEND_URL=https://barak-theta.vercel.app
NODE_ENV=production
PORT=5000
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Admin add product shows error | Backend not deployed or API_URL wrong |
| 404 on /admin page | Clear browser cache, wait for Vercel rebuild |
| Products not showing in Supabase | Check database connection in Render logs |
| CORS errors | Frontend URL not set correctly in backend env vars |

---

## Next Steps After Deployment

1. Set up database migrations: `npm run migrate`
2. Create admin user: `npm run create-admin`
3. Test payment integration with Stripe
4. Set up email notifications (SMTP)
5. Configure domain (barak.tea)

See `DEPLOYMENT.md` for full checklist.
