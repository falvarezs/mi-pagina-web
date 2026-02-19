import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://feookjimftquqkwhgwfj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb29ramltZnRxdXFrd2hnd2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjI0MTcsImV4cCI6MjA4NjIzODQxN30.oR22_B7m_cofPUkgjdNR2ai-NZB-tCi0M_WIj2Z3oaM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
