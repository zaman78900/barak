# 🚀 BARAK Tea - DEPLOYMENT QUICK START

## ✅ WHAT I'VE DONE FOR YOU
- ✅ Frontend built & production-ready (460KB bundle)
- ✅ Backend verified & syntax-checked
- ✅ Created `Procfile` for Render deployment
- ✅ Created `vercel.json` for Vercel optimization  
- ✅ Created `.env.production` template
- ✅ Generated complete deployment guide: [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md)

---

## 🎯 YOUR 6-STEP DEPLOYMENT (Takes ~30 minutes)

### Step 1: Push Code to GitHub (5 min)
```powershell
cd "d:\barak web 2\barak-tea-app"
git init
git add .
git commit -m "Initial BARAK Tea deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/barak-tea.git
git push -u origin main
```

### Step 2: Deploy Frontend on Vercel (5 min)
1. Go to **https://vercel.com**
2. Click "New Project" → Import your `barak-tea` repo
3. Set:
   - Framework: **Vite**
   - Build: `cd frontend && npm run build`
   - Output: `frontend/dist`
4. Add env variables:
   - `VITE_API_URL` = `https://api.barak.tea/api` (or Render URL later)
   - `VITE_STRIPE_PUBLIC_KEY` = your Stripe key
5. Click Deploy → Wait 3-5 min ✅

### Step 3: Deploy Backend on Render (5 min)
1. Go to **https://render.com**
2. Click "New +" → "Web Service"
3. Select your `barak-tea` GitHub repo
4. Set:
   - Name: `barak-tea-api`
   - Build: `cd backend && npm install`
   - Start: `node backend/server.js`
5. Add ALL env variables from [.env.production](./.env.production)
   - Replace placeholders with YOUR actual credentials
6. Click Deploy → Wait 5-10 min ✅

### Step 4: Update Frontend with Backend URL (2 min)
1. Go to Vercel Settings → Environment Variables
2. Update `VITE_API_URL` = your Render URL (e.g., `https://barak-tea-api.onrender.com/api`)
3. Click "Redeploy" on latest deployment ✅

### Step 5: Test Everything (5 min)
**Frontend:**
```powershell
# Visit your Vercel URL and test:
# ✓ Home page loads
# ✓ Shop page shows products
# ✓ Sign up works
```

**Backend:**
```powershell
# In PowerShell, test the API:
curl https://barak-tea-api.onrender.com/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Step 6: Setup Optional Services (5 min each)
- 📧 **Email**: Gmail app password
- 💳 **Payments**: Stripe live keys
- 📱 **WhatsApp**: Twilio credentials

---

## 📋 WHAT YOU NEED TO PROVIDE

**GitHub:**
- GitHub username & repo access

**Supabase:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Email (Gmail):**
- Email address
- App password (16 chars from myaccount.google.com/apppasswords)

**Stripe (Optional):**
- `STRIPE_SECRET_KEY` (sk_live_...)
- `STRIPE_PUBLIC_KEY` (pk_live_...)

**Twilio (Optional):**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`

---

## 🔗 YOUR DEPLOYMENT URLS (After completing steps)

| Service | URL | Where to Get |
|---------|-----|--------------|
| Frontend | `https://barak-tea.vercel.app` | Vercel dashboard |
| Backend | `https://barak-tea-api.onrender.com` | Render dashboard |
| Database | Supabase project | Your Supabase dashboard |

---

## ✨ FINAL CHECKLIST

- [ ] GitHub repo created and code pushed
- [ ] Vercel project connected
- [ ] Frontend deployed successfully
- [ ] Render project created for backend
- [ ] All 15+ env variables added to Render
- [ ] Backend deployed successfully
- [ ] Frontend env updated with backend URL
- [ ] Frontend redeployed
- [ ] `/health` endpoint returns 200 OK
- [ ] Frontend loads and shows products
- [ ] Sign up page works
- [ ] (Optional) Stripe configured
- [ ] (Optional) Email service configured

---

## 🆘 QUICK TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Frontend shows 404 | Clear cache, redeploy on Vercel |
| API calls fail | Check `VITE_API_URL` matches Render URL |
| Products don't load | Verify SUPABASE keys in Render env |
| Images not showing | Check Supabase Storage bucket permissions |
| Deploy takes too long | Render free tier can be slow (5-10 min) |

---

## 📚 DETAILED GUIDE

**For step-by-step instructions with screenshots and troubleshooting:**
👉 See [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md)

---

## 🎯 ESTIMATED TIME: 30-45 minutes total

**Start with Step 1 now and let me know when you're done with Step 2!**
