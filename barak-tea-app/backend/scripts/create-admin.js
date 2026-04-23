#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import logger from '../src/utils/logger.js';

async function createAdmin() {
  try {
    const adminEmail = 'admin@test.com'; // Simple valid email
    const adminPassword = 'ChangeMe123!';

    logger.info(`Creating admin user: ${adminEmail}`);

    // Use admin client to bypass RLS
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Try to create admin user with admin client
    const timestamp = new Date().toISOString();
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        email: adminEmail,
        password_hash: hashedPassword,
        full_name: 'BARAK Admin',
        phone: '+919999999999',
        role: 'admin',
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (userError) {
      logger.warn(`User insert error: ${userError.message}`);
      // Try querying if user exists
      const { data: existing } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', adminEmail)
        .single();
      
      if (existing) {
        logger.info(`ℹ️  User already exists`);
        process.exit(0);
      }
      throw userError;
    }

    // Create customer record for admin
    await supabaseAdmin.from('customers').insert([{
      user_id: user.id,
      phone: '+919999999999',
    }]).select().single();

    logger.info(`✅ Admin user created successfully!`);
    logger.info(`📧 Email: ${adminEmail}`);
    logger.info(`🔐 Password: ${adminPassword}`);
    logger.info(`🆔 User ID: ${user.id}`);
    
    process.exit(0);
  } catch (error) {
    logger.error(`Failed to create admin user: ${error.message}`);
    process.exit(1);
  }
}

createAdmin();
