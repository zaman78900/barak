# Backend Deployment to Render (Step-by-Step)

## STEP 1: Push Code to GitHub

```bash
cd d:\barak\ web\ 2
git init
git add .
git commit -m "BARAK Tea - Full Stack App"
git remote add origin https://github.com/YOUR_USERNAME/barak-tea.git
git push -u origin main
```

## STEP 2: Create Render Account & Deploy Backend

1. Go to **https://render.com** (free tier works fine)
2. Sign up with GitHub
3. Click **"New +"** → Select **"Web Service"**
4. Choose your GitHub repository
5. Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `barak-tea-api` |
| **Environment** | `Node` |
| **Build Command** | `cd barak-tea-app/backend && npm install` |
| **Start Command** | `node barak-tea-app/backend/server.js` |
| **Region** | Choose closest to you |

## STEP 3: Set Environment Variables on Render

In Render dashboard, go to **Settings → Environment**:

```
SUPABASE_URL=https://YOUR_SUPABASE_URL.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET=your_super_secret_32_char_key_here
NODE_ENV=production
FRONTEND_URL=https://barak-theta.vercel.app
PORT=5000
```

⚠️ **Get your Supabase credentials:**
- Log in to Supabase
- Project Settings → API
- Copy the URL and Keys

## STEP 4: Get Backend URL

After deployment completes on Render:
- Your backend URL will be: `https://barak-tea-api-xxxx.onrender.com`
- Copy this URL

## STEP 5: Update Frontend API Configuration

Update Vercel environment variables:

1. Go to **https://vercel.com** → Your Project Settings
2. Go to **Settings → Environment Variables**
3. Add/Update:

```
VITE_API_URL=https://barak-tea-api-xxxx.onrender.com/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

Replace `barak-tea-api-xxxx` with your actual Render service name.

## STEP 6: Redeploy Frontend

Push a small change to trigger Vercel rebuild:

```bash
# Just touch a file to trigger rebuild
git commit --allow-empty -m "Trigger rebuild with new API URL"
git push
```

## STEP 7: Test Admin Functionality

1. Open **https://barak-theta.vercel.app/admin**
2. Try adding a product
3. It should now work and appear on the main site

---

## Troubleshooting

### API calls returning 404
- Check backend URL in Vercel environment variables
- Make sure Render deployment is complete (green status)
- Check browser DevTools Network tab for actual API URL being called

### CORS errors
- Backend already has CORS configured for `FRONTEND_URL`
- Make sure environment variable is set correctly

### Backend won't start
- Check the Render deployment logs for errors
- Verify all environment variables are set
- Check Supabase credentials are correct

