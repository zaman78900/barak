// MUST load .env FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function main() {
  // Now dynamically import modules that depend on env variables
  const { supabaseAdmin } = await import('../src/utils/supabase.js');
  const logger = (await import('../src/utils/logger.js')).default;

  async function migrate() {
    try {
      logger.info('🚀 Starting BARAK Tea database setup...');

      // Check if tables exist by querying products table
      const { data: existing, error: checkError } = await supabaseAdmin
        .from('products')
        .select('id', { count: 'exact' })
        .limit(1);

      if (checkError && checkError.code === 'PGRST116') {
        // Tables don't exist - user needs to create them manually
        logger.error('❌ Database tables not found!');
        logger.error('');
        logger.error('📋 To set up your database:');
        logger.error('1. Go to Supabase Dashboard > SQL');
        logger.error('2. Copy the contents of src/models/schema.js');
        logger.error('3. Paste and run the SQL in the SQL editor');
        logger.error('4. Run this migration script again');
        logger.error('');
        process.exit(1);
      } else if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      logger.info('✅ Database tables verified');

      // Insert demo products
      logger.info('📊 Inserting demo products...');

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

      const { error: productsError, data: productsData } = await supabaseAdmin
        .from('products')
        .insert(demoProducts)
        .select();

      if (productsError) {
        logger.warn(`⚠️  Could not insert demo products: ${productsError.message}`);
      } else {
        logger.info(`✅ Inserted ${productsData?.length || 0} demo products`);
      }

      logger.info('');
      logger.info('🎉 Migration setup complete!');
      logger.info('📌 Your database is ready for the application.');
      logger.info('');
      logger.info('Next steps:');
      logger.info('1. Start backend: npm start');
      logger.info('2. In new terminal, start frontend: npm run dev');
      logger.info('3. Visit http://localhost:5173');
      logger.info('');
    } catch (error) {
      logger.error(`❌ Migration failed: ${error.message}`);
      logger.error('Details:', error);
      process.exit(1);
    }
  }

  await migrate();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
