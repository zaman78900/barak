# Fix: Create Admin User via SQL

The email validation constraint is blocking creation. Use this SQL instead:

## Option 1: Insert Valid Email Directly (EASIEST)

Go to **Supabase → SQL Editor** and run:

```sql
-- First, create the admin user with a valid email
INSERT INTO users (email, password_hash, full_name, phone, role)
VALUES (
  'barakadmin@gmail.com',
  '$2a$10$aK1dbz2JmHan3Qj5xmrch.1okJILINotJSBoA1XZnLivynZhNahpO',
  'BARAK Admin',
  '+91 9876543210',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
```

Then use these credentials to login:
- **Email:** `barakadmin@gmail.com`
- **Password:** `admin123`

---

## Option 2: Fix Using ALTER TABLE

If you want to remove the constraint entirely:

```sql
-- Check what constraints exist first
SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='users';

-- Then drop the actual constraint (replace with correct name if different)
ALTER TABLE users DROP CONSTRAINT users_email_check;

-- Or disable the check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_check;
```

---

## Option 3: Update the Regex Constraint

```sql
-- Make it accept any valid email format
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS email_valid,
ADD CONSTRAINT email_valid CHECK (email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$');
```

---

## What to Do NOW:

1. **Use the hashed password from Option 1** - it's `admin123` pre-hashed
2. Go to Supabase SQL Editor
3. Run the INSERT query from Option 1
4. Try logging in with `barakadmin@gmail.com` / `admin123`

This will bypass the email validation issue completely!
