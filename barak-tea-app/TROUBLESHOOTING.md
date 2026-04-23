# Troubleshooting Guide - BARAK Tea

## Common Issues & Solutions

### Frontend Issues

#### 1. Tailwind Styles Not Applying
**Problem**: Classes like `text-barak-cream` not working
**Solutions**:
```bash
# Clear Next cache
rm -rf .next

# Rebuild Tailwind
npm install -D tailwindcss postcss autoprefixer

# Check tailwind.config.js has correct path
// Should include:
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
]

# Restart dev server
npm run dev
```

#### 2. Animations Not Working
**Problem**: Framer Motion animations not showing
**Solutions**:
```bash
# Verify Framer Motion installed
npm list framer-motion

# Check browser DevTools > Performance tab for issues

# Verify prefers-reduced-motion not enabled
Settings > Accessibility > Remove animations (Chrome)

# Test with simpler animation first
<motion.div initial={{opacity: 0}} animate={{opacity: 1}} />
```

#### 3. Lenis Smooth Scroll Not Smooth
**Problem**: Scroll not smooth or jumpy
**Solutions**:
```javascript
// In App.jsx, check Lenis initialization
useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,      // Adjust timing
    easing: (t) => t,   // Try linear first
  });

  // Verify RAF loop is running
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}, []);
```

#### 4. Particles Animation Not Showing
**Problem**: Particle canvas is blank
**Solutions**:
```javascript
// HeroSection.jsx - Check canvas initialization
const updateCanvasSize = () => {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = window.innerWidth;      // Not rect.width!
  canvas.height = window.innerHeight;
};

// Check particle colors
ctx.fillStyle = `rgba(200, 146, 42, ${p.opacity})`;

// Verify requestAnimationFrame is called
requestAnimationFrame(() => this.animate());
```

#### 5. Mobile Menu Not Opening
**Problem**: Hamburger menu not responding
**Solutions**:
```jsx
// Check state update in Navbar.jsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
  {/* Make sure onClick is properly bound */}
</button>

// Verify z-index is high enough (z-40)
className="fixed inset-0 z-40 pt-20"
```

#### 6. API Calls Returning 404
**Problem**: API endpoints not found
**Solutions**:
```javascript
// Check Vite proxy in vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}

// Verify backend port is 5000
// Check backend server is running

// Test with curl
curl http://localhost:5000/health
```

#### 7. JWT Token Not Persisting
**Problem**: User logged out on page refresh
**Solutions**:
```javascript
// In store/index.js, check localStorage setup
export const useAuthStore = create((set) => ({
  token: localStorage.getItem('authToken') || null,

  setAuth: (token, user) => {
    localStorage.setItem('authToken', token);  // Persist token
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

// Clear localStorage and login again
localStorage.clear();
```

#### 8. Console Shows CORS Errors
**Problem**: Request blocked by CORS policy
**Solutions**:
```javascript
// In backend server.js, verify CORS config
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,  // Important!
  })
);

// Check .env has correct FRONTEND_URL
// Set in backend .env:
FRONTEND_URL=http://localhost:5173
```

---

### Backend Issues

#### 1. Database Connection Fails
**Problem**: "Cannot connect to Supabase"
**Solutions**:
```bash
# Verify .env file exists with correct values
cat backend/.env

# Check credentials are correct
# Supabase dashboard > Settings > API

# Test connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient('URL', 'KEY');
client.from('users').select('count').limit(1).then(r => console.log(r));
"

# Verify firewall allows outbound HTTPS
```

#### 2. JWT Token Invalid/Expired
**Problem**: Token verification failing
**Solutions**:
```javascript
// Check JWT_SECRET is same everywhere
// backend/.env
JWT_SECRET=your-super-secret-key-min-32-chars

// Verify token generation in auth.js
import { generateToken } from '../utils/auth.js';
const token = generateToken(user.id, user.email, 'user');

// Check token expiry time (7 days)
expiresIn: '7d'

// Clear stored token and login again
localStorage.removeItem('authToken');
```

#### 3. Migration Script Fails
**Problem**: Database schema not created
**Solutions**:
```bash
# Run migration with error output
cd backend
node --trace-warnings scripts/migrate.js

# Check schema.sql is valid
# Try creating table manually in Supabase

# View Supabase error logs
# Dashboard > Logs > Functions

# Verify Supabase RLS not blocking inserts
# Settings > Policies (temporarily disable RLS for setup)
```

#### 4. 500 Internal Server Errors
**Problem**: Backend crashes on API call
**Solutions**:
```bash
# Check backend logs
node backend/server.js

# Look for error stack trace

# Common causes:
# - Missing .env variable
# - Invalid database query
# - Missing error try/catch

# Add logging to find issue
import logger from '../utils/logger.js';
logger.error(`Error: ${error.message}`);
```

#### 5. Password Hashing Not Working
**Problem**: Passwords stored as plain text
**Solutions**:
```javascript
// In auth.js route, verify bcrypt hashing
import bcrypt from 'bcryptjs';

// During registration
const hashedPassword = await bcrypt.hash(password, 10);
// Store hashedPassword in DB

// During login
const isValid = await bcrypt.compare(password, user.password_hash);

// Verify bcryptjs installed
npm list bcryptjs
```

#### 6. Pagination Not Working
**Problem**: API always returns all results
**Solutions**:
```javascript
// In products.js route, check pagination
const offset = (page - 1) * limit;

const { data, count, error } = await query
  .range(offset, offset + limit - 1)  // Critical!
  .order('created_at', { ascending: false });

// Return pagination metadata
res.json({
  products: data,
  pagination: {
    page: parseInt(page),
    limit: parseInt(limit),
    total: count,
    pages: Math.ceil(count / limit),
  },
});
```

#### 7. Orders Not Saving to Database
**Problem**: Create order endpoint returns 500
**Solutions**:
```javascript
// In orders.js, verify all required fields
if (!items || !items.length) {
  return res.status(400).json({ error: 'Order items required' });
}

// Check customer exists
const { data: customer } = await supabase
  .from('customers')
  .select('id')
  .eq('user_id', userId)
  .single();

// Verify order table structure matches schema
// Check for NOT NULL constraints not being met
```

#### 8. Logger Not Creating Files
**Problem**: logs directory empty
**Solutions**:
```bash
# Create logs directory
mkdir -p backend/logs

# Check file permissions
chmod 755 backend/logs

# Verify Winston config in utils/logger.js
transports: [
  new Winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error' 
  }),
  new Winston.transports.File({ 
    filename: 'logs/combined.log' 
  }),
]

# Check disk space
df -h
```

---

### Database Issues

#### 1. Tables Not Created
**Problem**: Relations fail with "table doesn't exist"
**Solutions**:
```bash
# Run migration script
cd backend
npm run migrate

# Verify in Supabase dashboard
# Home > Tables (should see 11 tables)

# Check schema.js hasn't changed
git status src/models/schema.js

# If tables exist, seed default data
node scripts/migrate.js --seed
```

#### 2. Foreign Key Constraint Fails
**Problem**: "Foreign key constraint violated"
**Solutions**:
```javascript
// When creating order, verify customer_id exists
const { data: customer } = await supabase
  .from('customers')
  .select('id')
  .eq('user_id', userId)
  .single();

if (!customer) {
  return res.status(404).json({ error: 'Customer not found' });
}

// Then create order with valid customer_id
const { data: order } = await supabase
  .from('orders')
  .insert([{ customer_id: customer.id, ... }]);
```

#### 3. Duplicate Key Error (23505)
**Problem**: Email already exists when registering
**Solutions**:
```javascript
// In auth.js, handle duplicate
if (error.code === '23505') {
  return res.status(409).json({ error: 'Email already exists' });
}

// Educate user to use different email
// Or offer password reset flow
```

#### 4. Slow Queries
**Problem**: API responses take >5 seconds
**Solutions**:
```bash
# Check Supabase query performance
# Dashboard > Logs > Database

# Add missing indexes (already in schema.js)
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

# Optimize queries in code
// Instead of SELECT *
SELECT id, name, price, stock_quantity

// Limit results with pagination
.range(offset, offset + 99)

// Use specific joins only
```

---

### Performance Issues

#### 1. Slow Page Load
**Problem**: Homepage takes >3 seconds to load
**Solutions**:
```bash
# Check Lighthouse score
# DevTools > Lighthouse > Generate report

# Optimize images
# Use .webp format
# Compress with TinyPNG

# Lazy load below-fold content
# Use React.lazy() and Suspense

# Code split routes
const Shop = lazy(() => import('./pages/Shop.jsx'));

# Check bundle size
npm install -g webpack-bundle-analyzer
npm run build -- --analyze
```

#### 2. Animations Causing Jank
**Problem**: Scrolling/animations are herky-jerky
**Solutions**:
```javascript
// Use GPU acceleration
className="transform-gpu"

// Or in CSS
will-change: transform;

// Reduce particle count
const count = window.innerWidth > 768 ? 15 : 8;

// Disable shadows during scroll
// Use intersection observer to detect scroll

// Test in Chrome DevTools > Performance tab
// Record and check for dropped frames
```

#### 3. Memory Leaks
**Problem**: App gets slower over time
**Solutions**:
```javascript
// Clean up effects
useEffect(() => {
  const listener = () => { /* ... */ };
  window.addEventListener('scroll', listener);
  
  // IMPORTANT: Remove listener on cleanup
  return () => window.removeEventListener('scroll', listener);
}, []);

// Stop Lenis on unmount
useEffect(() => {
  // ...
  return () => lenis.destroy();
}, []);

// Check DevTools > Memory tab
// Look for growing heap size
```

---

### Deployment Issues

#### 1. Build Fails on Vercel
**Problem**: Deployment error: "Build failed"
**Solutions**:
```bash
# Check build command in vercel.json
// Should be for frontend only
"buildCommand": "cd frontend && npm install && npm run build"

# Check output directory
"outputDirectory": "frontend/dist"

# Common errors:
# - Missing .env variable → Set in Vercel dashboard
# - TypeScript errors → Fix or set skipLibCheck: true
# - Tailwind not found → Ensure postcss.config.js in frontend/

# Test build locally first
npm run build
npm run preview
```

#### 2. Backend Won't Start
**Problem**: Render deployment fails to start
**Solutions**:
```bash
# Check start command
node backend/server.js

# Or use Procfile
echo "web: node backend/server.js" > Procfile

# Verify all env vars set in Render dashboard

# Test locally
npm start

# Check for port binding
# Make sure app listens on process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {...})
```

#### 3. Frontend Can't Reach Backend
**Problem**: API calls fail in production
**Solutions**:
```javascript
// Set correct API URL in .env
VITE_API_URL=https://api.barak.tea/api

// Or use relative path (preferred)
const API_BASE_URL = '/api';

// Check CORS setup on backend
app.use(cors({
  origin: 'https://barak.tea',  // Set production URL
  credentials: true
}));

// Test endpoint directly
curl https://api.barak.tea/api/health
```

#### 4. Supabase Connection in Production
**Problem**: Database connection times out
**Solutions**:
```bash
# Verify Supabase keys in environment
# Use SERVICE_ROLE_KEY for admin operations
# Use ANON_KEY for public operations

# Check IP whitelist (if using Supabase firewall)
# Supabase dashboard > Settings > Network

# Test from server
curl https://your-project.supabase.co/rest/v1/users?select=count
  -H "apikey: your-anon-key"
```

---

### Git & Version Control

#### 1. Merge Conflicts
**Problem**: Cannot merge feature branch
**Solutions**:
```bash
# View conflicts
git diff

# Find conflict markers
<<<<<<< HEAD
current code
=======
incoming code
>>>>>>> branch-name

# Use GUI tool for easier resolution
git mergetool

# After resolving
git add .
git commit -m "Resolve merge conflict"
```

#### 2. Large File Size
**Problem**: Build artifacts added to git
**Solutions**:
```bash
# Check .gitignore includes
node_modules/
dist/
.env
.env.local
logs/

# Remove already-committed files
git rm -r --cached node_modules/
git commit -m "Remove node_modules from git"

# Install git-lfs for large files
brew install git-lfs
git lfs track "*.psd"
```

---

## Quick Reference

### Ports
- Frontend: http://localhost:5173
- Backend: http://localhost:5000 (or 5000 via proxy)
- Supabase: https://xxx.supabase.co

### Key Files
- Frontend styling: `frontend/tailwind.config.js`
- Backend routes: `backend/src/routes/`
- Database: `backend/src/models/schema.js`
- Env template: `backend/.env.example`

### Health Checks
```bash
# Frontend running
curl http://localhost:5173

# Backend running
curl http://localhost:5000/health

# Database connected
curl http://localhost:5000/api/products?limit=1
```

### Reset Everything
```bash
# Clear browser
localStorage.clear();
sessionStorage.clear();

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reset database
# Supabase dashboard > SQL > Drop all tables
# Then: npm run migrate
```

---

## Getting Help

1. **Check Logs**
   - Browser console: DevTools > Console tab
   - Backend: Terminal output or logs/error.log
   - Supabase: Dashboard > Logs

2. **Search Documentation**
   - README.md for overview
   - ARCHITECTURE.md for technical details
   - DEPLOYMENT.md for production issues

3. **Test in Isolation**
   - Use Postman/Insomnia to test API
   - Test individual components in Storybook
   - Run migrations in fresh Supabase project

4. **Common Fixes**
   - Restart dev server
   - Clear cache (browser + npm)
   - Reinstall dependencies
   - Check .env variables
   - Verify ports available

---

**Last Updated**: April 2026
**Status**: Comprehensive Guides Available ✅
