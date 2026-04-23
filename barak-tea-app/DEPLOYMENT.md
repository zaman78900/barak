# Deployment Guide - BARAK Tea

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Frontend builds without errors
- [ ] Backend tests passing
- [ ] HTTPS enabled on frontend
- [ ] API endpoints verified with Postman/Insomnia
- [ ] Database backups configured
- [ ] Error tracking (Sentry) setup
- [ ] Analytics tracking (Google Analytics) setup
- [ ] Email service tested
- [ ] Payment gateway (Stripe) configured

## Frontend Deployment (Vercel)

### 1. Connect Repository
```bash
# Push code to GitHub
git init
git add .
git commit -m "Initial BARAK Tea commit"
git remote add origin https://github.com/username/barak-tea.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Set project name: `barak-tea`
5. Framework: Vue.js → Select **Vite** preset
6. Build command: `cd frontend && npm run build`
7. Output directory: `frontend/dist`
8. Install command: `cd frontend && npm install`

### 3. Environment Variables
Set in Vercel dashboard Settings > Environment Variables:
```
VITE_API_URL=https://api.barak.tea/api
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### 4. Domain Configuration
1. Go to Settings > Domains
2. Add custom domain (e.g., barak.tea)
3. Update DNS records as shown
4. SSL certificate auto-generates

## Backend Deployment (Render)

### 1. Prepare Repository
```bash
# Create Procfile in backend/
echo "web: node server.js" > Procfile

# Create build script if needed
echo "cd backend && npm install" > build.sh
```

### 2. Deploy to Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configuration:
   - **Name**: barak-tea-api
   - **Runtime**: Node
   - **Build command**: `cd backend && npm install`
   - **Start command**: `node backend/server.js`

### 3. Environment Variables
Set in Render dashboard:
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://barak.tea
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
STRIPE_SECRET_KEY=sk_live_xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### 4. Database Backups
- Supabase auto-backs up daily (free tier)
- Configure weekly backup email notifications
- Download backup monthly for redundancy

## Database Setup (Supabase)

### 1. Create Tables
```bash
cd backend
npm run migrate
```

### 2. Set Row Level Security (RLS)
For production security, enable RLS on all tables:

```sql
-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_select ON users FOR SELECT
  USING (auth.uid() = id OR role = 'admin');
CREATE POLICY users_update ON users FOR UPDATE
  USING (auth.uid() = id);

-- Similar policies for orders, customers, etc.
```

### 3. Configure Database Backups
1. Go to Backups in Supabase dashboard
2. Enable daily backups
3. Download backup monthly

## Monitoring & Analytics

### 1. Set Up Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// frontend/src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### 2. Add Analytics (Google Analytics)
```bash
npm install react-ga4
```

```javascript
// frontend/src/App.jsx
import ReactGA from "react-ga4";

ReactGA.initialize("G-XXXXXXXXXX");
ReactGA.send({ hitType: "pageview", page: location.pathname });
```

### 3. Health Checks
Set up monitoring for:
- Frontend: Uptime monitoring via Pingdom
- Backend: `/health` endpoint (already in code)
- Database: Supabase status page

## SSL/HTTPS Configuration

### Frontend (Automatic with Vercel)
- SSL automatically provisioned
- Auto-renewal enabled
- HSTS header automatically set

### Backend (with Let's Encrypt)
```bash
# On Render: Automatic with custom domain
# For self-hosted:
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d api.barak.tea
```

## Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --analyze

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
# Enable caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

# Compress responses
npm install compression
app.use(compression());
```

## Database Migration Steps

```bash
# Development to Production
1. Backup development database
2. Export schema: pg_dump -s dbname > schema.sql
3. Import to production: psql < schema.sql
4. Migrate data with migration scripts
5. Run integration tests
6. Monitor for errors
7. Keep backup for rollback
```

## Rollback Plan

### If Frontend Breaks
1. Revert commit: `git revert <commit-hash>`
2. Push to main branch
3. Vercel auto-deploys (takes ~2-3 mins)
4. Test thoroughly before considering fixed

### If Backend Breaks
1. Check logs in Render dashboard
2. Revert code: `git revert <commit-hash>`
3. Manually trigger deploy
4. Verify `/health` endpoint responds
5. Monitor error tracking (Sentry)

### If Database Breaks
1. Stop all API requests immediately
2. Restore from latest backup (Supabase)
3. Notify affected users
4. Run integrity checks
5. Monitor for data inconsistencies

## Production Checklist

### Security
- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] CORS whitelist set correctly
- [ ] Rate limiting enabled
- [ ] SQL injection prevention
- [ ] XSS protection headers set
- [ ] CSRF tokens implemented

### Performance
- [ ] Frontend lighthouse score > 90
- [ ] API response time < 500ms
- [ ] Database query optimization done
- [ ] Caching headers configured
- [ ] CDN enabled for static assets
- [ ] Images optimized for web

### Monitoring
- [ ] Error tracking active (Sentry)
- [ ] Analytics enabled (Google Analytics)
- [ ] Uptime monitoring configured
- [ ] Log aggregation enabled
- [ ] Database backups scheduled
- [ ] Performance monitoring active

### Documentation
- [ ] API documentation complete
- [ ] Database schema documented
- [ ] Deployment steps documented
- [ ] Troubleshooting guide written
- [ ] Team trained on runbook

## Support & Maintenance

### Regular Tasks
- **Weekly**: Check error logs, monitor performance
- **Monthly**: Review analytics, update dependencies
- **Quarterly**: Security audit, capacity planning
- **Annually**: Disaster recovery drill

### Emergency Contacts
- Hosting support: Render/Vercel
- Database support: Supabase
- Domain support: Domain registrar
- SSL support: Let's Encrypt community

---

**Last Updated**: April 2026
**Status**: Production Ready ✅
