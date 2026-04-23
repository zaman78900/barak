#!/usr/bin/env node
// Auto-create database tables using Supabase SQL
// This script splits the schema into individual statements and executes them

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function setupDatabase() {
  const { supabaseAdmin } = await import('../src/utils/supabase.js');
  const logger = (await import('../src/utils/logger.js')).default;

  logger.info('🚀 Starting automatic database setup...');

  try {
    // Tables to create in order (with dependencies)
    const tables = [
      // 1. Users table (no dependencies)
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 2. Customers table
      `CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        phone TEXT NOT NULL,
        city TEXT,
        orders_count INTEGER DEFAULT 0,
        total_spent DECIMAL(10, 2) DEFAULT 0,
        loyalty_points INTEGER DEFAULT 0,
        loyalty_tier TEXT DEFAULT 'Bronze' CHECK (loyalty_tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
        joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 3. Products table
      `CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price DECIMAL(8, 2) NOT NULL,
        mrp DECIMAL(8, 2),
        stock_quantity INTEGER DEFAULT 0,
        sold_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 4. Orders table
      `CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
        order_number TEXT UNIQUE,
        total_amount DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(8, 2) DEFAULT 0,
        discount_amount DECIMAL(8, 2) DEFAULT 0,
        shipping_cost DECIMAL(8, 2) DEFAULT 0,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),
        payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
        shipping_address TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 5. Order Items table
      `CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price_at_purchase DECIMAL(8, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(order_id, product_id)
      );`,

      // 6. Shipments table
      `CREATE TABLE IF NOT EXISTS shipments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        tracking_number TEXT UNIQUE,
        carrier TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'failed')),
        estimated_delivery_date DATE,
        actual_delivery_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 7. Coupons table
      `CREATE TABLE IF NOT EXISTS coupons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT UNIQUE NOT NULL,
        discount_percent DECIMAL(5, 2),
        discount_flat DECIMAL(8, 2),
        max_amount DECIMAL(8, 2),
        min_order_amount DECIMAL(8, 2),
        valid_from DATE,
        valid_until DATE,
        max_uses INTEGER,
        used_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'deactivated')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 8. Reviews table
      `CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title TEXT,
        comment TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        helpful_count INTEGER DEFAULT 0,
        verified_purchase BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 9. Wholesale Enquiries table
      `CREATE TABLE IF NOT EXISTS wholesale_enquiries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT,
        quantity_needed INTEGER,
        message TEXT,
        status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'rejected')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 10. Product Variants table
      `CREATE TABLE IF NOT EXISTS product_variants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        size_ml INTEGER,
        weight_g INTEGER,
        price_modifier DECIMAL(8, 2) DEFAULT 0,
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, name)
      );`,

      // 11. Newsletter subscribers table
      `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced')),
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Create indexes for performance
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
      `CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`,
      `CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);`,
      `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`,
      `CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);`,
      `CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);`,
      `CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);`,
      `CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);`,
      `CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);`,
      `CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);`,
    ];

    // Execute each table creation statement
    let created = 0;
    for (const sql of tables) {
      try {
        const { error } = await supabaseAdmin.rpc('exec', { sql });
        if (error && error.message.includes('does not exist')) {
          // RPC function doesn't exist - use alternative method
          logger.warn('⚠️  Cannot execute SQL via RPC. Please manually create tables.');
          logger.warn('See SETUP_DATABASE.md for instructions.');
          return;
        }
        if (error && !error.message.includes('already exists')) {
          throw error;
        }
        created++;
      } catch (err) {
        // Table might already exist - that's okay
        if (!err.message.includes('already exists')) {
          logger.warn(`⚠️  ${err.message}`);
        }
      }
    }

    logger.info(`✅ Created/verified ${created} tables and indexes`);

    // Insert demo data
    const demoProducts = [
      {
        name: 'Classic CTC Dust',
        category: 'Everyday',
        price: 180,
        mrp: 220,
        stock_quantity: 142,
        description: 'Hand-picked CTC leaves perfect for daily chai',
      },
      {
        name: 'Premium Leaf Grade CTC',
        category: 'Premium',
        price: 280,
        mrp: 340,
        stock_quantity: 68,
        description: 'Premium grade leaves with bold flavor profile',
      },
      {
        name: 'Morning Masala Blend',
        category: 'Blends',
        price: 220,
        mrp: 260,
        stock_quantity: 12,
        description: 'Perfectly spiced morning blend',
      },
      {
        name: 'Gift Box Collection',
        category: 'Gifts',
        price: 480,
        mrp: 580,
        stock_quantity: 34,
        description: 'Luxury gift collection with assorted teas',
      },
    ];

    const { error: productsError, data } = await supabaseAdmin
      .from('products')
      .insert(demoProducts)
      .select();

    if (!productsError) {
      logger.info(`📦 Inserted ${data?.length || 0} demo products`);
    }

    logger.info('');
    logger.info('✅ Database setup complete!');
    logger.info('');
    logger.info('Next: Run your application');
    logger.info('  Backend:  npm start');
    logger.info('  Frontend: npm run dev');
    logger.info('');

  } catch (error) {
    logger.error(`❌ Setup failed: ${error.message}`);
    process.exit(1);
  }
}

setupDatabase();
