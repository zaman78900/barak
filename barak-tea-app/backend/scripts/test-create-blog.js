import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { supabase } from '../src/utils/supabase.js';

async function test() {
  try {
    console.log('Inserting test blog with anon client...');
    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title: 'Test Blog Title with Anon Client',
        category: 'Brewing',
        excerpt: 'Test excerpt',
        content: 'Test content',
        image_url: '',
        read_time: '5 min read',
        status: 'published',
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select();
    
    console.log('Result:', { data, error });
  } catch (err) {
    console.error('Exception:', err);
  }
}

test();
