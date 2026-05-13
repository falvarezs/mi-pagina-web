import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://feookjimftquqkwhgwfj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb29ramltZnRxdXFrd2hnd2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjI0MTcsImV4cCI6MjA4NjIzODQxN30.oR22_B7m_cofPUkgjdNR2ai-NZB-tCi0M_WIj2Z3oaM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storageKey: 'chef-rondon-auth',
  }
});

// ── Mantener Supabase activo (ping cada 4 días) ──────────────────────
// Supabase pausa proyectos inactivos después de 7 días en plan gratuito
const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;

async function keepAlive() {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.warn('⚠️ Keep-alive ping falló:', error.message);
    } else {
      console.log('✅ Supabase keep-alive OK:', new Date().toLocaleString());
    }
  } catch (err) {
    console.warn('⚠️ Keep-alive error:', err);
  }
}

// Ejecutar ping inmediatamente al cargar la app
keepAlive();

// Repetir cada 4 días mientras la app esté abierta
setInterval(keepAlive, FOUR_DAYS_MS);