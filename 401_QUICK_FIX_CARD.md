# 401 Error Fix - Quick Reference Card

## The Problem
✅ GET requests work (list products)
❌ POST requests fail with 401 (save products)
❌ Token not stored in localStorage

## The Root Cause
Missing `withCredentials: true` in axios config + overly restrictive CORS = Authorization header not sent

## Files Already Fixed

| File | Change | Lines |
|------|--------|-------|
| api.js | Added `withCredentials: true` + logging | ALL |
| AdminLogin.jsx | Added token storage verification | 14-45 |
| auth.js | Enhanced logging | ALL |
| server.js | Fixed CORS configuration | 22-46 |

## Deployment Steps

### 1. Verify Admin User Exists (2 min)
```sql
-- Supabase SQL Editor
SELECT id, email, role FROM users WHERE email = 'admin@barak.tea';
-- Should return 1 row with role='admin'
```

### 2. Set Render Environment Variables (3 min)
Go to Render Dashboard → barak-tea-api → Environment:
```
JWT_SECRET = [your 32+ char secret]
FRONTEND_URL = https://barak-theta.vercel.app
NODE_ENV = production
```

### 3. Deploy Frontend (Vercel) (5 min)
```bash
cd "d:\barak web 2\barak-tea-app\frontend"
git add .
git commit -m "fix: Token storage and CORS for 401 auth"
git push origin main
```
Wait for auto-deploy ✓

### 4. Deploy Backend (Render) (5 min)
```bash
cd "d:\barak web 2\barak-tea-app\backend"
git add .
git commit -m "fix: Auth logging and CORS"
git push origin main
```
Wait for auto-deploy ✓

## Quick Tests

### Test 1: Token Storage (30 sec)
1. Open https://barak-theta.vercel.app/admin/login
2. F12 → Console tab
3. Login with: admin@barak.tea / admin123
4. Run in console:
```javascript
localStorage.getItem('authToken')
// Should return long JWT string starting with 'eyJ'
```

### Test 2: Product Creation (1 min)
1. Navigate to Products
2. Click Add Product
3. Fill form and submit
4. Check DevTools Network tab:
```
POST /api/products → Status 201 (not 401)
```

## If Still Getting 401

Check in order:
1. [ ] `localStorage.getItem('authToken')` returns value (not null)
2. [ ] Value starts with 'eyJ' (valid JWT)
3. [ ] Supabase has admin user with role='admin'
4. [ ] JWT_SECRET set on Render (not empty/undefined)
5. [ ] Both frontend and backend redeployed
6. [ ] Browser cache cleared (Ctrl+Shift+Delete)

## Debug Commands

```javascript
// Verify token in console
JSON.parse(atob(localStorage.getItem('authToken').split('.')[1]))
// Shows: { userId, email, role, exp }

// Clear and test fresh login
localStorage.clear()
// Then refresh and login again
```

## Key Points

✅ Token must START with 'eyJ' (JWT format)
✅ Token must BE IN localStorage (not null/undefined)
✅ Request headers must have: `Authorization: Bearer eyJ...`
✅ Response from login must include `{ token: '...', user: {...} }`

## Support

If issues after 2 hours:
1. Comment in deployment logs
2. Run: `localStorage.getItem('authToken')`
3. Check: Render logs for `[Auth]` messages
4. Verify: Admin user in Supabase

---

**Status**: All code fixed ✓ | Ready to deploy ✓ | Follow checklist above

