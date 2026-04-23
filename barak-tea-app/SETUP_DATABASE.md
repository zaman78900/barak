# 🗄️ BARAK Tea Database Setup

## Status: ⏳ Tables Not Created Yet

Your Supabase connection is working! Now you need to create the database tables.

---

## Step 1: Get the SQL Schema

The SQL schema is ready in:
```
backend/src/models/schema.js
```

## Step 2: Create Tables in Supabase

### Method A: Using Supabase Dashboard (Recommended) ✅

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project: `ugjirmknkrfgrrusvsgw`

2. **Open SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

3. **Copy Database Schema**
   - Open `backend/src/models/schema.js` in your editor
   - Copy everything between the backticks (the SQL code)

4. **Paste and Execute**
   - Paste the SQL into the Supabase query editor
   - Click **Run** (or press `Ctrl+Enter`)
   - Wait for confirmation: "✅ Queries executed successfully"

5. **Verify Tables**
   - Go to **Table Editor** in left sidebar
   - You should see 11 tables:
     ✓ users
     ✓ customers
     ✓ products
     ✓ product_variants
     ✓ orders
     ✓ order_items
     ✓ shipments
     ✓ coupons
     ✓ reviews
     ✓ wholesale_enquiries
     ✓ newsletter_subscribers

---

## Step 3: Complete the Migration

Once tables are created in Supabase, run:

```bash
cd backend
npm run migrate
```

You should see:
```
2026-04-22 HH:MM:SS [info]: 🚀 Starting BARAK Tea database setup...
2026-04-22 HH:MM:SS [info]: ✅ Database tables verified
2026-04-22 HH:MM:SS [info]: 📊 Inserting demo products...
2026-04-22 HH:MM:SS [info]: ✅ Inserted 4 demo products
2026-04-22 HH:MM:SS [info]: 🎉 Migration setup complete!
```

---

## Troubleshooting

### Error: "Table already exists"
- You already created the tables ✓
- Just run `npm run migrate` to add demo data

### Error: "Permission denied"
- Check that your Supabase project is public or you have correct permissions
- Go to **Settings > Policies** and temporarily disable RLS for setup

### Error: "Column already exists"
- The table structure is already there
- This is normal - tables might be partially created
- Run `npm run migrate` to complete setup

### Supabase Project Not Showing?
- Go to https://app.supabase.com login
- Create a new FREE project
- Copy credentials to `backend/.env`:
  ```env
  SUPABASE_URL=https://your-url.supabase.co
  SUPABASE_ANON_KEY=your-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-key
  ```

---

## Next Steps After Database is Ready

```bash
# In one terminal - Backend
cd backend
npm start

# In another terminal - Frontend
cd frontend
npm run dev

# Open in browser
# http://localhost:5173
```

---

## Database Schema Overview

| Table | Purpose | Records |
|-------|---------|---------|
| users | Authentication accounts | Demo: 0 (create on signup) |
| customers | Customer profiles | Demo: 0 (linked to users) |
| products | Tea products catalog | Demo: 4 (auto-inserted) |
| product_variants | Size/variant options | Demo: 0 |
| orders | Customer orders | Demo: 0 |
| order_items | Order line items | Demo: 0 |
| shipments | Delivery tracking | Demo: 0 |
| coupons | Discount codes | Demo: 0 |
| reviews | Product reviews | Demo: 0 |
| wholesale_enquiries | B2B requests | Demo: 0 |
| newsletter_subscribers | Email subscribers | Demo: 0 |

---

## 📋 Checklist

- [ ] Opened Supabase dashboard
- [ ] Opened SQL Editor
- [ ] Copied SQL from `backend/src/models/schema.js`
- [ ] Pasted into Supabase query editor  
- [ ] Executed SQL (no errors)
- [ ] Verified 11 tables in Table Editor
- [ ] Ran `npm run migrate`
- [ ] See success message with "4 demo products inserted"
- [ ] Ready to start backend & frontend! 🎉

---

**Having issues?**
- Check TROUBLESHOOTING.md for detailed debugging
- Re-read this file carefully - most issues are setup related
- Make sure .env has correct Supabase credentials
