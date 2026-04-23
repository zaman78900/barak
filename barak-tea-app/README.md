# BARAK Tea - E-Commerce Platform
Premium CTC tea from Barak Valley with professional full-stack implementation.

## Project Structure

```
barak-tea-app/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── styles/        # Global styles
│   │   ├── store/         # State management
│   │   └── utils/         # Utilities
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/               # Node.js + Express backend
    ├── src/
    │   ├── routes/        # API endpoints
    │   ├── controllers/    # Route handlers
    │   ├── middleware/     # Custom middleware
    │   ├── services/       # Business logic
    │   ├── models/         # Database schemas
    │   └── utils/          # Helper functions
    ├── scripts/            # Database migration scripts
    ├── server.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (https://supabase.com)

### 1. Clone & Install

```bash
cd barak-tea-app

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Environment Setup

**Backend** - Create `.env` file:
```bash
cp .env.example .env
# Update with your actual values
```

**Frontend** - Create `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

1. Create a Supabase project at https://supabase.com
2. Update backend `.env` with Supabase credentials
3. Run migrations:
```bash
cd backend
npm run migrate
```

### 4. Start Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173

## Features

### Frontend
✅ Glassmorphism dark luxury design
✅ Smooth scroll animations (Lenis)
✅ Particle effects on hero
✅ Responsive mobile design
✅ Product catalog with filtering
✅ Shopping cart system
✅ User authentication
✅ Order tracking

### Backend
✅ RESTful API with Express
✅ JWT authentication
✅ Database with Supabase (PostgreSQL)
✅ Order management
✅ Customer management
✅ Product catalog
✅ Review & rating system
✅ Wholesale enquiries
✅ Coupon system
✅ Shipment tracking

## API Endpoints

### Authentication
```
POST   /api/auth/register        - User registration
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get current user
PUT    /api/auth/profile         - Update profile
```

### Products
```
GET    /api/products             - List all products
GET    /api/products/:id         - Get product details
POST   /api/products             - Create product (admin)
PUT    /api/products/:id         - Update product (admin)
DELETE /api/products/:id         - Delete product (admin)
```

### Orders
```
GET    /api/orders               - Get user orders
GET    /api/orders/:id           - Get order details
POST   /api/orders               - Create order
PATCH  /api/orders/:id/status    - Update order status (admin)
```

### Coupons
```
POST   /api/coupons/validate     - Validate coupon code
GET    /api/coupons              - List coupons (admin)
POST   /api/coupons              - Create coupon (admin)
```

### Reviews
```
GET    /api/reviews              - List reviews
POST   /api/reviews              - Create review
PATCH  /api/reviews/:id          - Approve/reject review (admin)
```

### Wholesale
```
GET    /api/wholesale            - List enquiries (admin)
POST   /api/wholesale            - Submit enquiry
PATCH  /api/wholesale/:id/status - Update status (admin)
```

### Shipments
```
GET    /api/shipments            - List shipments (admin)
GET    /api/shipments/track/:num - Track shipment
POST   /api/shipments            - Create shipment (admin)
PATCH  /api/shipments/:id/status - Update status (admin)
```

## Database Schema

Tables:
- `users` - User accounts
- `customers` - Customer profiles
- `products` - Product catalog
- `product_variants` - Product size/variants
- `orders` - Customer orders
- `order_items` - Items in orders
- `shipments` - Shipping information
- `coupons` - Discount codes
- `reviews` - Product reviews
- `wholesale_enquiries` - B2B requests
- `newsletter_subscribers` - Email subscribers

## Technologies Used

### Frontend
- React 18
- Vite
- Framer Motion (animations)
- Lenis (smooth scroll)
- Tailwind CSS
- Zustand (state management)
- React Router

### Backend
- Node.js
- Express
- Supabase (PostgreSQL)
- JWT (authentication)
- Bcrypt (password hashing)
- Winston (logging)

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Connect repository to Vercel
```

### Backend (Render/Railway/Heroku)
```bash
npm run build
npm start
```

## Notes
- All passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- Images stored in AWS S3 (optional)
- WhatsApp integration ready (Twilio)
- Email notifications via Nodemailer
