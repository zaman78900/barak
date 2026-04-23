# BARAK Tea - Architecture & Design System

## 🎨 Design Philosophy

**BARAK Tea** is built with a **"Dark Luxury + Glassmorphism"** aesthetic designed to evoke premium, sophisticated brand positioning.

### Color Palette (60-30-10 Rule)
- **60% - Background**: `#0D0905` (Near-black warm tone, prevents coldness)
- **30% - Glass Surfaces**: `rgba(250,243,224,0.08)` (Frosted cream at 8% opacity)
- **10% - Accents**: `#C8922A` (Gold for CTAs, highlights, active states)

### Typography
- **Font**: Inter (exclusively, no script fonts)
- **Display**: 80-120px, weight 700-900, tight leading (0.95), aggressive tracking (-0.04em)
- **Headlines**: 24-48px, weight 700, tracking -0.02em
- **Body**: 14-16px, weight 400-500, line-height 1.8
- **Labels**: 11-13px, weight 500-600, tracking 0.05em

### Component Design Rules
- **Border Radius**: 16px (cards), 24px (pills/badges), 8px (inputs), 12px (buttons)
- **Glass Effect**: `backdrop-filter: blur(12px)` on all surfaces
- **Shadows**: 
  - Default: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(250,243,224,0.1)`
  - Hover: `0 12px 48px rgba(200,146,42,0.15), inset 0 1px 0 rgba(250,243,224,0.15)`
- **Transitions**: All `0.35s cubic-bezier(0.4, 0, 0.2, 1)` (premium feel)
- **Spacing Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96px

## 🏗️ Frontend Architecture

### Tech Stack
- **Framework**: React 18 with Hooks
- **Build Tool**: Vite (lightning-fast bundling)
- **Styling**: Tailwind CSS + custom glass component classes
- **State Management**: Zustand (lightweight store)
- **Navigation**: React Router v6
- **Animations**: Framer Motion + Lenis smooth scroll
- **HTTP Client**: Axios with interceptors
- **Icons**: Phosphor Icons (20-24px)

### Folder Structure
```
frontend/src/
├── components/
│   ├── Navbar.jsx           - Sticky glass navbar with scroll detection
│   ├── Footer.jsx           - Section footer with social links
│   └── sections/
│       ├── HeroSection.jsx  - Hero with particle animation
│       ├── FeatureBento.jsx - Feature cards grid
│       ├── FeaturedProducts.jsx
│       ├── OriginStory.jsx
│       ├── BrewGuideTeaser.jsx
│       ├── TestimonialsSection.jsx
│       └── NewsletterSection.jsx
├── pages/
│   ├── Homepage.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── BrewGuide.jsx
│   ├── OurStory.jsx
│   ├── Wholesale.jsx
│   ├── Blog.jsx
│   └── AdminDashboard.jsx
├── store/
│   └── index.js            - Zustand stores (auth, cart, products)
├── utils/
│   ├── api.js              - Axios instance with interceptors
│   └── hooks.js            - Custom React hooks (useProducts, useOrders, etc.)
└── styles/
    └── globals.css         - Tailwind + glass component definitions
```

### Key Components

#### Navbar
- **Fixed positioning** with scroll-triggered glass effect
- **Mobile menu** with staggered animations
- **Responsive design** with hamburger on mobile
- **Shopping cart badge** with count

#### Hero Section
- **Particle animation**: HTML5 Canvas with 30 interactive tea-leaf particles
- **Word-by-word reveals**: Each word animates with stagger
- **Parallax scrolling**: 0.5x speed on background image
- **Scroll indicator**: Bouncing chevron fade on scroll

#### Product Cards
- **Hover interactions**: Scale + glow shadow + gradient effect
- **Responsive layout**: 1/2/3/4 columns on mobile/tablet/desktop/ultra-wide
- **Loading states**: Skeleton screens while fetching
- **Lazy loading**: Images load on scroll

#### Animations
- **Scroll triggers**: `whileInView` for performance
- **Stagger**: Child elements animate with `staggerChildren`
- **Easing**: Smooth cubic-bezier for premium feel
- **Reduced motion**: Respects `prefers-reduced-motion` for accessibility

## 🛠️ Backend Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT + Bcrypt
- **API Design**: RESTful with structured routes
- **Logging**: Winston with file rotation
- **Validation**: Joi for input validation

### Folder Structure
```
backend/src/
├── routes/
│   ├── auth.js             - Login/register/profile
│   ├── products.js         - Product CRUD
│   ├── orders.js           - Order management
│   ├── customers.js        - Customer profiles
│   ├── coupons.js          - Discount codes
│   ├── reviews.js          - Product reviews
│   ├── wholesale.js        - B2B enquiries
│   └── shipments.js        - Shipment tracking
├── middleware/
│   ├── auth.js             - JWT verification
│   └── errorHandler.js     - Global error handling
├── services/               - Business logic (email, payments, etc.)
├── models/
│   └── schema.js           - Database schema definitions
└── utils/
    ├── logger.js           - Winston logger setup
    ├── supabase.js         - Supabase client initialization
    └── auth.js             - JWT token generation/verification
```

### API Design Principles
- **RESTful routes**: Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **Consistent response format**: All responses include data + metadata
- **Error handling**: Standardized error codes + messages
- **Pagination**: Offset-based with page + limit params
- **Filtering**: Query params for status, category, search
- **Sorting**: Order by creation date (newest first) by default
- **Authentication**: JWT tokens in Authorization header
- **Authorization**: Role-based (user/admin) checks per endpoint

### Database Design
- **Normalized schema**: Separate tables for each entity
- **Foreign keys**: Referential integrity with ON DELETE CASCADE
- **Indexes**: On frequently queried columns (user_id, status, created_at)
- **Constraints**: Email validation, enum status checks
- **Timestamps**: created_at (immutable), updated_at (on change)

### Authentication Flow
1. User registers with email/password
2. Password hashed with bcrypt (salt rounds: 10)
3. JWT token generated (expires: 7 days)
4. Token stored in localStorage (client-side)
5. Token sent in Authorization header for all requests
6. Server verifies token signature + expiry
7. Request user added to `req.user` object

### Error Handling
- **Validation errors**: 400 Bad Request
- **Authentication errors**: 401 Unauthorized
- **Authorization errors**: 403 Forbidden
- **Not found**: 404 Not Found
- **Conflicts**: 409 Conflict (duplicate email, etc.)
- **Server errors**: 500 Internal Server Error
- **Custom error middleware**: Catches all errors globally

## 🔄 State Management

### Zustand Stores

**Auth Store**
```javascript
- user: User object or null
- token: JWT token or null
- isAuthenticated: Boolean
- setAuth(token, user): Set authenticated user
- logout(): Clear auth state
```

**Cart Store**
```javascript
- items: Array of cart items
- total: Calculated total price
- addItem(product): Add to cart
- removeItem(id, variant): Remove from cart
- updateQuantity(id, variant, qty): Update quantity
- clearCart(): Empty cart
- calculateTotal(): Recalculate total
```

**Product Store**
```javascript
- products: Array of products
- favorites: Array of favorite product IDs
- setProducts(products): Load products
- toggleFavorite(id): Add/remove from favorites
```

## 🎯 Animation Strategy

### Principles
1. **Purpose-driven**: Every animation serves user experience
2. **Performance**: RequestAnimationFrame + GPU acceleration
3. **Accessibility**: Respect `prefers-reduced-motion`
4. **Consistency**: Same easing curve across app

### Animation Types
1. **Scroll-triggered fades**: Content reveals on scroll
2. **Staggered reveals**: Child elements animate sequentially
3. **Hover effects**: Subtle scale + glow on interactive elements
4. **Page transitions**: Smooth fade-ins between routes
5. **Particle effects**: Canvas-based physics simulation

### Framer Motion Best Practices
- Use `whileInView` with `viewport={{ once: true }}` to prevent reanimation
- Use `variants` for reusable animation patterns
- Set `initial` state to avoid layout shift on load
- Use `transition={{ duration: 0.6, delay: index * 0.1 }}` for stagger

## 🚀 Deployment Strategy

### Frontend
- **Build**: `npm run build` → optimized bundle in `/dist`
- **Hosting**: Vercel (auto-deploy on push)
- **CDN**: Vercel Edge Network
- **Env vars**: Set in Vercel dashboard
- **Build command**: `vite build`
- **Start command**: `npm run preview`

### Backend
- **Build**: Standard Node.js app
- **Hosting**: Render, Railway, or Heroku
- **Environment**: Production Node.js 18+
- **Start command**: `node server.js`
- **Env vars**: Set in platform dashboard
- **Database**: Supabase (managed PostgreSQL)

### CI/CD
- GitHub Actions for automated deployments
- Lint check on pull requests
- Tests before merge (coming soon)
- Automatic deployment on main branch push

## 📊 Database Schema Relationships

```
users (1) ──────────── (many) customers
                            ├── orders
                            │    ├── order_items
                            │    └── shipments
                            └── reviews

products (1) ──────────── (many) product_variants
           ├── order_items
           └── reviews

coupons (1) ──────────── (many) orders
wholesale_enquiries (independent)
newsletter_subscribers (independent)
```

## 🔐 Security Considerations

- **Password hashing**: Bcrypt with 10 salt rounds
- **Token storage**: localStorage (vulnerable to XSS, but acceptable for demo)
- **HTTPS**: Required for production
- **CORS**: Whitelist frontend URL
- **SQL injection**: Protected by Supabase parameterized queries
- **Rate limiting**: Implement per-endpoint (coming soon)
- **Input validation**: Joi schemas on all inputs

## 🎓 Code Standards

### Frontend
- Functional components + React Hooks only
- Props validation via inline comments
- Descriptive component/function names
- Export default component at end
- Use Tailwind utility classes (not inline styles)

### Backend
- Async/await for all async operations
- Error handling in try/catch blocks
- Descriptive error messages
- Logging at key points
- Validation before database operations
- Consistent response structure

---

**Last Updated**: April 2026
**Status**: Production Ready ✅
