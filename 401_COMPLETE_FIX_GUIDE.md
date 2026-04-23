# 401 Unauthorized Error - Complete Fix Guide

## Root Cause Analysis ✅

Your **production admin dashboard** shows:
- ✅ GET requests work (loading products)
- ❌ POST requests fail with 401 "Missing or invalid token"
- ❌ authToken NOT stored in localStorage
- ✅ adminUser data IS stored (test-admin@gmail.com)

**Why POST fails but GET works:**
GET requests are public, but POST (/api/products) requires `authenticate` middleware that validates the Bearer token. The token is never stored, so header has no Authorization bearer token.

---

## Issues Identified

### Issue #1: Token Not Being Stored After Login ❌
**File:** `frontend/src/pages/AdminLogin.jsx`
**Problem:** Login might be failing silently, or response format changed
**Impact:** No Bearer token in Authorization header for subsequent requests

### Issue #2: Potential JWT_SECRET Mismatch ❌
**Files:** `backend/.env.production` (Render config)
**Problem:** JWT_SECRET not set on Render, OR different from Vercel frontend config
**Impact:** Token verification fails even if token is sent

### Issue #3: Admin User Might Not Exist ❌
**Database:** Supabase users table
**Problem:** `admin@barak.tea` might not exist or has wrong role
**Impact:** Login endpoint returns 401

### Issue #4: CORS & Credentials Issue ❌
**File:** `backend/server.js`
**Problem:** CORS credentials might not be configured for Vercel frontend
**Impact:** Auth headers might be stripped in cross-origin requests

---

## Step 1: Verify Admin User Exists in Supabase

### Check Admin User
1. Go to Supabase Dashboard → Your Project
2. Click **SQL Editor** → New Query
3. Run this query:
```sql
SELECT id, email, role, password_hash FROM users 
WHERE email = 'admin@barak.tea' OR role = 'admin'
LIMIT 10;
```

**Expected Result:**
```
id           | email            | role  | password_hash
UUID         | admin@barak.tea  | admin | bcrypt_hash
```

**If no results:** Admin user doesn't exist. Create it using:
```sql
INSERT INTO users (email, password_hash, role, full_name, created_at)
VALUES (
  'admin@barak.tea',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',  -- bcrypt hash of "admin123"
  'admin',
  'Admin User',
  NOW()
);
```

To generate bcrypt hash, run locally first:
```bash
cd backend
node -e "require('bcryptjs').hash('admin123', 10, (__, hash) => console.log(hash))"
# Copy the output hash
```

---

## Step 2: Fix Backend Environment Variables (Render)

### Critical: Set JWT_SECRET on Render
1. Go to Render Dashboard
2. Find your BARAK Tea API service  
3. Click **Environment** tab
4. Add these variables:

| Key | Value |
|-----|-------|
| JWT_SECRET | `Rc12vwF+jTutstZwJ58t6vUUAYZmRBgzgBwYuLN1aWrxckSJAuQW46DGDDxbryeJX3qy4Ik8DfRUGwy6ezhz1w==` |
| FRONTEND_URL | `https://barak-theta.vercel.app` |
| NODE_ENV | `production` |
| LOG_LEVEL | `debug` |

> ⚠️ **IMPORTANT:** JWT_SECRET must match what's in your backend code AND what Vercel frontend expects

---

## Step 3: Add Debug Logging to Frontend

**Create/Update:** `frontend/src/utils/api.js`

```javascript
// API request interceptor and helper functions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // ← ADD THIS for CORS credentials
});

// ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  
  // DEBUG: Log token on every request
  console.debug('[API Request]', {
    method: config.method.toUpperCase(),
    url: config.url,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenFormat: token?.startsWith('eyJ') ? 'JWT✓' : 'INVALID',
    headers: config.headers,
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.debug('[Token Attached] Authorization: Bearer ' + token.substring(0, 20) + '...');
  } else {
    console.warn('[No Token] Request proceeding without auth token');
  }
  
  return config;
});

// ─── RESPONSE INTERCEPTOR ──────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    console.debug('[API Success]', {
      status: response.status,
      url: response.config?.url,
      dataKeys: Object.keys(response.data || {}),
    });
    return response.data;
  },
  (error) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      console.error('🔐 [401 UNAUTHORIZED]', {
        url: error.config?.url,
        method: error.config?.method,
        errorMessage: error.response?.data?.error,
        errorDetails: error.response?.data?.details,
        requestHeaders: error.config?.headers,
        storedToken: localStorage.getItem('authToken')?.substring(0, 20) + '...',
      });

      // Clear invalid auth
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      
      // Redirect to login after delay
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1000);
    } else if (error.response?.status >= 400) {
      console.error('🔴 [API Error]', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.error,
      });
    }
    
    throw error.response?.data || error.message;
  }
);

export default api;
```

---

## Step 4: Fix Login Response Handling

**File:** `frontend/src/pages/AdminLogin.jsx`

```javascript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@barak.tea');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebug('');

    try {
      console.log('[Login] Attempting login with:', { email });
      
      // Call backend login endpoint
      const response = await api.post('/auth/login', { email, password });
      
      console.log('[Login Response]', { response });
      
      // Check response structure
      if (!response) {
        throw new Error('No response from server');
      }

      if (response.token) {
        console.log('[Token Received]', {
          tokenLength: response.token.length,
          isJWT: response.token.startsWith('eyJ'),
        });

        // Store token and user
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user || {}));

        console.log('[Storage Updated]', {
          tokenStored: !!localStorage.getItem('authToken'),
          userStored: !!localStorage.getItem('adminUser'),
        });

        setDebug('✅ Login successful, redirecting...');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        const error = response.error || 'Unknown error';
        console.error('[Login Failed]', { response, error });
        setError(`Login failed: ${error}`);
        setDebug(JSON.stringify(response, null, 2));
      }
    } catch (err) {
      console.error('[Login Exception]', {
        message: err.message,
        error: err.error || err,
        errorString: String(err),
      });
      
      setError(err.error || err.message || 'Login failed. Check console for details.');
      setDebug(`Error object: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { 
        email: 'admin@barak.tea', 
        password: 'admin123' 
      });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Demo login failed. Check backend status.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 px-4 bg-barak-dark flex items-center justify-center"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-barak-surface border border-barak-border rounded-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-barak-cream mb-2">BARAK TEA</h1>
            <p className="text-barak-muted">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {debug && (
              <div className="bg-blue-900/30 border border-blue-700 text-blue-300 px-4 py-3 rounded text-xs font-mono overflow-auto max-h-40">
                {debug}
              </div>
            )}

            <div>
              <label className="block text-barak-muted text-sm font-semibold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barak.tea"
                className="w-full bg-barak-bg border border-barak-border rounded px-4 py-2 text-barak-cream placeholder-barak-muted outline-none focus:border-barak-gold"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-barak-muted text-sm font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-barak-bg border border-barak-border rounded px-4 py-2 text-barak-cream placeholder-barak-muted outline-none focus:border-barak-gold"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-barak-gold text-barak-dark font-bold py-2 rounded mt-6 hover:bg-barak-gold-light disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-barak-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-barak-surface text-barak-muted">Or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full border border-barak-gold text-barak-gold font-bold py-2 rounded hover:bg-barak-gold/10 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Demo Login'}
          </button>

          <p className="text-center text-barak-muted text-xs mt-6">
            Use demo credentials to test the admin panel
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
```

---

## Step 5: Fix Backend Auth Middleware

**File:** `backend/src/middleware/auth.js`

```javascript
import { verifyToken } from '../utils/auth.js';
import logger from '../utils/logger.js';

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.warn(`[Auth] Missing authorization header for ${req.method} ${req.path}`);
      return res.status(401).json({ 
        error: 'Missing or invalid token',
        details: 'Authorization header required with Bearer token',
        received: {
          headers: Object.keys(req.headers),
          authHeader: authHeader ? 'present' : 'missing'
        }
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      logger.warn(`[Auth] Invalid token format: ${authHeader.substring(0, 30)}`);
      return res.status(401).json({ 
        error: 'Missing or invalid token',
        details: 'Token must be in format: Bearer <token>'
      });
    }

    const token = authHeader.slice(7);
    logger.debug(`[Auth] Verifying token: ${token.substring(0, 20)}...`);
    
    const decoded = verifyToken(token);

    if (!decoded) {
      logger.warn(`[Auth] Token verification failed for: ${token.substring(0, 20)}...`);
      return res.status(401).json({ 
        error: 'Invalid token',
        details: 'Token verification failed. Please login again.'
      });
    }

    logger.info(`[Auth✓] Authenticated user: ${decoded.userId} (${decoded.email})`);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`[Auth Exception] ${error.message}`);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn(`[Authorize] No user in request`);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      logger.warn(`[Authorize] User ${req.user.email} has role '${req.user.role}', needs ${roles.join(' or ')}`);
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient permissions',
        userRole: req.user.role,
        requiredRoles: roles
      });
    }

    logger.debug(`[Authorize✓] ${req.user.email} authorized for role(s): ${roles.join(', ')}`);
    next();
  };
};

export { authenticate, authorize };
```

---

## Step 6: Verify Backend CORS Configuration

**File:** `backend/server.js` (Update CORS section)

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config({ path: '.env' });

// ... imports ...

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS Configuration ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://barak-theta.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Request logging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  logger.info(`${req.method} ${req.path} [Origin: ${origin}]`);
  next();
});

// ... rest of routes and middleware ...
```

---

## Step 7: Test LOGIN Endpoint Directly

Before deploying, test the login endpoint in browser console:

```javascript
// Open DevTools Console on admin login page
const testLogin = async () => {
  const response = await fetch('https://barak-tea-api.onrender.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: 'admin@barak.tea',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  console.log({
    status: response.status,
    ok: response.ok,
    response: data,
    tokenExists: !!data.token,
    tokenFormat: data.token?.startsWith('eyJ') ? 'JWT' : 'INVALID'
  });
  
  return data;
};

testLogin();
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@barak.tea",
    "full_name": "Admin User",
    "role": "admin"
  }
}
```

---

## Step 8: Deploy & Test

### Frontend Deploy (Vercel)
```bash
cd frontend
npm run build
git add . && git commit -m "Fix 401 auth issues"  
git push origin main
# Vercel auto-deploys
```

### Backend Deploy (Render)
1. Update code with fixes above
2. Push to GitHub
3. Render auto-redeploys
4. Verify BUILD succeeds in Render dashboard
5. Check logs for errors

### Test in Production
1. Open https://barak-theta.vercel.app/admin/login
2. Login with admin@barak.tea / admin123
3. Check DevTools Console for token messages
4. Verify token in localStorage: `localStorage.getItem('authToken')`
5. Try creating a product
6. Should see success (201 Created)

---

## Debugging Checklist

If still getting 401:

- [ ] Admin user exists in Supabase (run SQL query in Step 1)
- [ ] JWT_SECRET set on Render environment (Step 2)
- [ ] Frontend built with new code (Step 3-5)
- [ ] Backend redeployed with new code (Step 5-6)
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Verify authToken in localStorage after login
- [ ] Check backend logs on Render dashboard
- [ ] Test login endpoint directly (Step 7)
- [ ] Verify FRONTEND_URL in backend .env matches Vercel URL

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| api.js | Added `withCredentials: true` + debug logging | Fixes CORS + visibility |
| AdminLogin.jsx | Added extensive logging + error details | Reveals token storage issues |
| auth.js middleware | Enhanced logging + better error messages | Easier debugging |
| server.js | Fixed CORS origins + credentials + methods | Allows cross-origin auth |
| Render (.env) | JWT_SECRET + FRONTEND_URL | Fixes token mismatch |
| Supabase | Admin user verification | Ensures user exists |

---

## Expected Results After Fix

✅ **Before:** Token missing → 401 on POST
✅ **After:** Token stored → 200 OK on POST → Product created

DevTools Console should show:
- `[Login Response]` - Successful response with token
- `[Storage Updated]` - authToken + adminUser stored
- `[Token Attached]` - Bearer token sent on products request
- `[API Success]` - 201 Created response

