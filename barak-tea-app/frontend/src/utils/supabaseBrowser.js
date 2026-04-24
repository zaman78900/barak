import { createClient } from '@supabase/supabase-js';

let browserSupabase = null;

export function getBrowserSupabase() {
  if (browserSupabase) {
    return browserSupabase;
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  browserSupabase = createClient(url, anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
  });

  return browserSupabase;
}
