import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
let supabaseAdminInstance = null;

function initialize() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase credentials missing - ensure .env file is loaded');
  }

  supabaseInstance = createClient(url, anonKey);
  supabaseAdminInstance = createClient(url, serviceKey || anonKey);
}

// Create proxy objects that initialize on first use
const supabaseProxy = new Proxy({}, {
  get: (target, prop) => {
    if (!supabaseInstance) initialize();
    return supabaseInstance[prop];
  },
});

const supabaseAdminProxy = new Proxy({}, {
  get: (target, prop) => {
    if (!supabaseAdminInstance) initialize();
    return supabaseAdminInstance[prop];
  },
});

export const supabase = supabaseProxy;
export const supabaseAdmin = supabaseAdminProxy;
export default supabaseProxy;
