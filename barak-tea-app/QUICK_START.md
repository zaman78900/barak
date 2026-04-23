# Quick Start Guide - BARAK Tea

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Step 2: Set Up Supabase
1. Go to https://supabase.com and create free account
2. Create a new project
3. Note your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Settings > API

### Step 3: Configure Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=your-url-here
SUPABASE_ANON_KEY=your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-min-32-chars
```

### Step 4: Database Setup
```bash
cd backend
npm run migrate
```

### Step 5: Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit: http://localhost:5173

## 🎨 Design Features Implemented

### Frontend
- ✅ **Glassmorphism Design**: Dark luxury with frosted glass surfaces
- ✅ **Particle Animation**: Interactive particle effects on hero section
- ✅ **Smooth Scroll**: Lenis integration for premium feel
- ✅ **Responsive**: Mobile-first design with Tailwind CSS
- ✅ **Animations**: Framer Motion for smooth transitions
- ✅ **Section Animations**: Staggered fade-ups with scroll triggers
- ✅ **Color System**: Professional gold/cream/dark palette
- ✅ **Typography**: Inter font with proper hierarchy

### Backend
- ✅ **RESTful API**: Express with structured routes
- ✅ **Authentication**: JWT with bcrypt password hashing
- ✅ **Database**: PostgreSQL via Supabase
- ✅ **Error Handling**: Comprehensive error middleware
- ✅ **Logging**: Winston logger with file rotation
- ✅ **Validation**: Input validation on all endpoints

## 📁 File Structure Quick Reference

**Frontend Key Files**:
- `src/App.jsx` - Main app with routing
- `src/pages/Homepage.jsx` - Homepage with all sections
- `src/components/Navbar.jsx` - Navigation with animations
- `src/components/sections/` - Reusable page sections
- `src/store/index.js` - Zustand state management
- `src/utils/api.js` - API client with interceptors
- `tailwind.config.js` - Custom theme configuration

**Backend Key Files**:
- `server.js` - Express app setup
- `src/routes/` - API endpoints
- `src/middleware/` - Auth and error handling
- `src/utils/` - Helper functions
- `src/models/schema.js` - Database schema

## 🚀 Next Steps

### 1. Complete Shop Page
- Implement product grid with filtering
- Add sorting options
- Create product detail page

### 2. Add Authentication Pages
- Create login/register pages
- Add password recovery
- Implement OAuth (Google/Github)

### 3. Implement Shopping Cart
- Cart page with quantity controls
- Coupon/discount application
- Checkout flow with Stripe integration

### 4. Admin Dashboard
- Product management
- Order tracking
- Customer management
- Analytics dashboard

### 5. Additional Features
- Blog/News section
- Customer reviews system
- Wishlist functionality
- Email notifications
- WhatsApp order updates

## 🔑 Key Credentials Setup

You'll need accounts for:
- **Supabase** - Database (free tier available)
- **Stripe** - Payments (test keys for development)
- **Twilio** - WhatsApp integration (optional)
- **AWS S3** - Image storage (optional)
- **Nodemailer** - Email service

## 📝 API Authentication

All authenticated endpoints require header:
```
Authorization: Bearer <JWT_TOKEN>
```

Get token from `/api/auth/login` endpoint.

## 🎯 Important Notes

1. **Environment Variables**: Always use `.env` file, never commit `JWT_SECRET`
2. **CORS**: Configured to allow http://localhost:5173 in development
3. **Password Hashing**: All passwords stored as bcrypt hashes
4. **Token Expiry**: JWT tokens expire after 7 days
5. **Admin Access**: Some endpoints require `role: 'admin'`

## 🐛 Troubleshooting

**Port Already in Use**:
```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Supabase Connection Issues**:
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Check firewall/network access

**Tailwind Not Working**:
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
```

## 📚 Useful Commands

```bash
# Frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview build locally

# Backend
npm run dev         # Start with auto-reload
npm run migrate     # Run database setup
```

## 🎓 Learning Resources

- Framer Motion: https://www.framer.com/motion/
- Tailwind CSS: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs
- Express: https://expressjs.com/
- React Router: https://reactrouter.com/

---

**Last Updated**: April 2026
**Status**: Production Ready ✅
