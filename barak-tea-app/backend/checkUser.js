import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkUser() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'barakadmin@gmail.com');
    
  console.log('Result:', JSON.stringify({data, error}));
}

checkUser();
