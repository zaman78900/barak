import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function resetPassword() {
  const hash = bcrypt.hashSync('admin123', 10);
  const { data, error } = await supabase
    .from('users')
    .update({ password_hash: hash })
    .eq('email', 'barakadmin@gmail.com');
    
  console.log('Result:', JSON.stringify({data, error}));
}

resetPassword();
