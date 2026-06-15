import { createClient } from '@supabase/supabase-js';

// ── Leer claves desde variables de entorno ──────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Validación: las claves deben existir ────────────────────────────
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Faltan variables de entorno de Supabase. ' +
    'Verifica que .env.local exista con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
  );
}

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