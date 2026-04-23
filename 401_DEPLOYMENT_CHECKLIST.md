# 401 Error Fix - Deployment Checklist ✅

## Code Changes Applied ✓

- [x] **api.js** - Added `withCredentials: true` + enhanced debug logging
- [x] **AdminLogin.jsx** - Added token storage verification logging
- [x] **auth.js middleware** - Enhanced logging for troubleshooting
- [x] **server.js** - Fixed CORS configuration with proper origins

---

## Pre-Deployment Checks

### 1. Verify Admin User in Supabase ✓

**Go to Supabase Dashboard:**
1. Navigate to your project
2. Click **SQL Editor**
3. Create new query and run:

```sql
SELECT id, email, role, password_hash 
FROM users 
WHERE email = 'admin@barak.tea'
LIMIT 1;
```

**Expected Result:**
```
id: (UUID)
email: admin@barak.tea
role: admin
password_hash: $2a$10$... (bcrypt hash)
```

**If no results**, create the admin user:
```sql
-- First, generate bcrypt hash for "admin123"
-- Run locally: node -e "require('bcryptjs').hash('admin123', 10, (__, hash) => console.log(hash))"

INSERT INTO users (email, password_hash, role, full_name, created_at)
VALUES (
  'admin@barak.tea',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',
  'admin',
  'Admin User',
  NOW()
);
```

### 2. Check Backend Environment on Render ✓

**Go to Render Dashboard:**
1. Select your Backend Service (barak-tea-api)
2. Click **Environment** tab
3. Verify these variables exist:

| Variable | Value | Notes |
|----------|-------|-------|
| JWT_SECRET | (long 32+ char string) | ⚠️ Must match token generation |
| FRONTEND_URL | https://barak-theta.vercel.app | ⚠️ Must match Vercel URL |
| NODE_ENV | production | √ Standard setting |
| SUPABASE_URL | https://xxx.supabase.co | √ Your Supabase project |
| SUPABASE_ANON_KEY | eyJ... | √ From Supabase |
| SUPABASE_SERVICE_ROLE_KEY | eyJ... | √ From Supabase |

**If JWT_SECRET is missing or wrong:**
1. Get the JWT_SECRET from your `.env` file (or generate new one)
2. Copy the value to Render environment
3. Render will auto-redeploy with new env vars

### 3. Build Frontend ✓

```bash
cd "d:\barak web 2\barak-tea-app\frontend"
npm run build
```

**Expected:** Build completes without errors
- `✓ built in 45.12s`
- `/dist/index.html` created (check file exists)

### 4. Test Backend Locally (Optional but Recommended)

```bash
cd "d:\barak web 2\barak-tea-app\backend"
npm run dev
```

**Expected:** Server starts
- `🚀 BARAK Tea API running on http://0.0.0.0:5000`

Then test login in another terminal:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.tea","password":"admin123"}'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@barak.tea",
    "role": "admin",
    "full_name": "Admin User"
  }
}
```

---

## Deployment Steps

### Step 1: Deploy Frontend (Vercel)

**Option A: Automatic (Recommended)**
```bash
cd "d:\barak web 2\barak-tea-app\frontend"
git add .
git commit -m "fix: Token storage and CORS for 401 auth errors"
git push origin main
# Vercel automatically deploys
```

**Option B: Manual Vercel Deploy**
1. Go to Vercel Dashboard
2. Select BARAK Tea Frontend
3. Click **Redeploy** button
4. Wait for deployment complete (check status is green)

**Verify Deployment:**
- [ ] Build successful in Vercel logs
- [ ] Frontend URL accessible: https://barak-theta.vercel.app/admin/login

### Step 2: Deploy Backend (Render)

**Option A: Automatic (Recommended)**
```bash
cd "d:\barak web 2\barak-tea-app\backend"
git add .
git commit -m "fix: Auth middleware logging and CORS configuration"
git push origin main
# Render automatically redeploys
```

**Option B: Manual Render Deploy**
1. Go to Render Dashboard
2. Select barak-tea-api service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment complete

**Check Backend Logs:**
- [ ] Deployment status shows "Live" (green)
- [ ] Check logs for `🚀 BARAK Tea API running on...`
- [ ] No error messages in logs

---

## Post-Deployment Testing

### Test 1: Login & Token Storage ✓

1. Open **https://barak-theta.vercel.app/admin/login**
2. Open **DevTools** (F12 → Console tab)
3. Clear existing data: `localStorage.clear()`
4. Login with:
   - Email: `admin@barak.tea`
   - Password: `admin123`
5. Check Console output:
   - Should see `[Login] Response received:`
   - Should see `[Login] Auth stored successfully:`

6. Verify token in localStorage:
```javascript
// In DevTools Console:
localStorage.getItem('authToken')
// Should return a long JWT string starting with 'eyJ'
```

### Test 2: Product Creation ✓

1. After successful login, navigate to Products
2. Click **Add Product**
3. Fill in form:
   - Product Name: "Test Product Debug"
   - Selling Price: 199
   - MRP: 250
   - Stock: 50
4. Click **Add Product**
5. Check DevTools Network tab:
   - Request to `/api/products` should have status **201** (Created)
   - NOT 401 (Unauthorized)

6. Product should appear in list immediately

### Test 3: Verify Authorization Header ✓

In DevTools Console, run:
```javascript
// Verify token is in localStorage
const token = localStorage.getItem('authToken');
console.log('Token exists:', !!token);
console.log('Token starts with eyJ:', token?.startsWith('eyJ'));
console.log('Token length:', token?.length);

// Verify JWT structure (3 parts separated by dots)
const parts = token?.split('.');
console.log('JWT parts:', parts?.length); // Should be 3
```

---

## Troubleshooting

### Issue: Still seeing 401 After Login

**Symptoms:**
- Login appears successful but creating products still fails
- DevTools shows 401 error
- Network tab shows "Missing or invalid token" error

**Diagnosis:**
1. Check localStorage has token:
   ```javascript
   localStorage.getItem('authToken') // Should return long string, not null
   ```

2. Check token format:
   ```javascript
   const token = localStorage.getItem('authToken');
   console.log(token?.startsWith('eyJ')); // Should be true
   ```

3. Check DevTools Network → Request Headers:
   ```
   Authorization: Bearer eyJhbGci...
   ```

4. Check backend logs on Render:
   - Look for `[Auth]` messages
   - Check if JWT_SECRET error appears

**Solutions:**
- [ ] Refresh page: Ctrl+Shift+R
- [ ] Clear localStorage and login again
- [ ] Check Render environment variables (JWT_SECRET)
- [ ] Check Supabase user exists with role='admin'
- [ ] Check frontend build completed successfully

### Issue: Backend Returning 500 Error

**Check Render Logs:**
1. Go to Render Dashboard → barak-tea-api
2. Click **Logs** tab
3. Look for error messages near the time you tried logging in

**Common Issues:**
```
Error: JWT_SECRET undefined → Set JWT_SECRET in Render env
Error: User not found → Create admin user in Supabase
Error: Token verification failed → JWT_SECRET mismatch
```

### Issue: CORS Error - Origin Not Allowed

**Symptoms:**
```
Access to XMLHttpRequest at 'https://barak-tea-api.onrender.com/...'
from origin 'https://barak-theta.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Go to Render → Environment
2. Verify `FRONTEND_URL=https://barak-theta.vercel.app` is set
3. Redeploy backend (save env var will auto-trigger redeploy)

---

## Success Checklist

After all steps complete, verify:

- [ ] Admin dashboard loads at: https://barak-theta.vercel.app/admin
- [ ] Login succeeds with admin@barak.tea / admin123
- [ ] authToken appears in localStorage
- [ ] Product creation works (POST returns 201)
- [ ] Products display in admin panel
- [ ] Console shows no red errors
- [ ] Network tab shows successful API calls (200, 201 not 401)

---

## Rollback Plan (If Issues)

If something breaks:

```bash
# Frontend: Redeploy previous version in Vercel
1. Go to Vercel Dashboard
2. Click BARAK Tea Frontend
3. Go to Deployments
4. Find last working deployment
5. Click → Redeploy

# Backend: Rollback on Render
1. Go to Render Dashboard → barak-tea-api
2. Click Deployment history
3. Find last successful deployment
4. Click Rollback
```

---

## Quick Reference

### Endpoints
- Login: `POST /api/auth/login` → Returns token
- Verify Token: `GET /api/auth/me` → Requires Bearer token
- Create Product: `POST /api/products` → Requires Bearer token + admin role
- Get Products: `GET /api/products` → Public

### Tokens
- Format: `Authorization: Bearer <token>`
- Expiry: 7 days
- Type: JWT (JSON Web Token)
- Contains: `{ userId, email, role, expiresIn }`

### Debug Commands (DevTools Console)

```javascript
// Check token
localStorage.getItem('authToken');

// Verify JWT
JSON.parse(atob(localStorage.getItem('authToken').split('.')[1]));

// Check admin user
JSON.parse(localStorage.getItem('adminUser'));

// Clear everything
localStorage.clear();

// Manual login test
fetch('https://barak-tea-api.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@barak.tea', password: 'admin123' })
}).then(r => r.json()).then(d => console.log(d));
```

---

## Support Info

If further issues, include in bug report:
1. Error message from console
2. Request URL showing in Network tab
3. Response body (should show `{ error: '...', details: '...' }`)
4. Backend logs from Render
5. Supabase database query results for admin user

