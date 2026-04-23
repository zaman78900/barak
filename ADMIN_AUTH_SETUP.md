# 🔐 Admin Authentication Setup

## Problem Identified ✅
The admin panel requires authentication, but there's no way to log in. The backend API returns **401 Unauthorized** for all admin operations.

## Solution: 3 Steps

### STEP 1: Create Admin User on Backend

Run this command to create a default admin user:

```bash
cd d:\barak\ web\ 2\barak-tea-app\backend
npm run create-admin
```

This script creates a user with:
- **Email**: `admin@barak.tea`
- **Password**: `admin123`
- **Role**: `admin`

If the script doesn't exist or fails, you can manually create the user in Supabase:

1. Go to https://supabase.co
2. Go to your project → SQL Editor
3. Run this query:

```sql
INSERT INTO users (email, password_hash, full_name, role, created_at, updated_at)
VALUES (
  'admin@barak.tea',
  crypt('admin123', gen_salt('bf')),
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

### STEP 2: Rebuild & Deploy Frontend

I've added authentication to the admin panel. Rebuild and push:

```bash
cd d:\barak\ web\ 2
npm run build
git add .
git commit -m "Add admin authentication"
git push
```

### STEP 3: Test Admin Login

1. Go to https://barak-theta.vercel.app/admin
2. You'll see the login page
3. Enter credentials:
   - **Email**: `admin@barak.tea`
   - **Password**: `admin123`
4. Click **Login**
5. You'll be redirected to the admin dashboard
6. Now try adding a product - it should work!

---

## What I Fixed

### Files Changed
- ✅ `frontend/src/pages/AdminLogin.jsx` - New login page
- ✅ `frontend/src/App.jsx` - Added authentication protection
- ✅ Routes now require valid token for `/admin`

### Architecture
1. User visits `/admin`
2. If no token in localStorage → shows login page
3. User logs in with email/password
4. Backend returns JWT token
5. Token stored in localStorage
6. All API calls include token in Authorization header
7. Admin can now add/edit/delete products

---

## How It Works

When you log in:
```javascript
// Login submits to backend
POST /api/auth/login { email, password }

// Backend returns token + user data
{ token: "jwt...", user: { id, email, role, ... } }

// Frontend stores token
localStorage.setItem('authToken', token)

// All future API calls include it
Authorization: Bearer jwt...
```

---

## Logout

To logout, just delete the token:
```javascript
localStorage.removeItem('authToken')
localStorage.removeItem('adminUser')
window.location.href = '/admin'
```

(You can add a logout button to the admin panel if needed)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Login page shows forever | Check backend is running on Render |
| `Invalid email or password` | Admin user not created - run create-admin script |
| Posts work but GET failed | Backend `.env.production` has wrong JWT_SECRET |
| Token expires | Tokens are valid for 30 days by default |

