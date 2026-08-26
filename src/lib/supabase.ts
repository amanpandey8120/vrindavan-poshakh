import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return { success: false, error };
    }

    console.log('✅ Supabase connected successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return { success: false, error: err };
  }
}