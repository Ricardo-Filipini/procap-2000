
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nzdbzglklwpklzwzmqbp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZGJ6Z2xrbHdwa2x6d3ptcWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMjc2ODUsImV4cCI6MjA3NzgwMzY4NX0.1C5G24n-7DrPownNpKlOyfzAni5mMlR4JlsGNwzOor0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
