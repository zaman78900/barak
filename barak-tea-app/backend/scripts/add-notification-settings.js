
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Starting migration: Create notification_settings table...');

  // Note: Using RPC to execute SQL if available, otherwise we'd need to use the SQL editor.
  // Since we might not have the RPC 'exec' defined on all environments, 
  // I will attempt to check if the table exists and create it if possible via a query if permitted,
  // but usually for DDL you need the SQL Editor or a specialized RPC.
  
  // Here I'll define the SQL and suggest the user to run it if the script fails to find a way.
  const sql = `
    CREATE TABLE IF NOT EXISTS notification_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email_enabled BOOLEAN DEFAULT true,
      whatsapp_enabled BOOLEAN DEFAULT false,
      email_recipients TEXT[] DEFAULT '{}',
      whatsapp_recipients TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Insert a default row if empty
    INSERT INTO notification_settings (email_enabled, whatsapp_enabled, email_recipients, whatsapp_recipients)
    SELECT true, false, '{}', '{}'
    WHERE NOT EXISTS (SELECT 1 FROM notification_settings);
  `;

  console.log('Please ensure the following SQL is executed in your Supabase SQL Editor:');
  console.log('----------------------------------------------------------------------');
  console.log(sql);
  console.log('----------------------------------------------------------------------');

  try {
    // Attempt to run via RPC if 'exec' exists (common in some Supabase setups)
    const { error } = await supabase.rpc('exec', { sql });
    if (error) {
      if (error.message.includes('function rpc.exec(text) does not exist')) {
        console.log('ℹ️ RPC "exec" function not found. Please run the SQL above in Supabase dashboard.');
      } else {
        console.error('❌ Migration failed:', error.message);
      }
    } else {
      console.log('✅ Migration completed successfully via RPC.');
    }
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  }
}

migrate();
