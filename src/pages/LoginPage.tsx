import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onLogin: (email: string) => void;
  onNavigate: (page: string) => void;
}

// ── Iconos ──────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
         9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
         a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
         M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
         m7.532 7.532l3.29 3.29M3 3l3.59 3.59
         m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
         a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

type Mode = 'login' | 'register' | 'forgot';

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [mode, setMode]               = useState<Mode>('login');
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage]         = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone]       = useState('');

  // ── Helpers ──────────────────────────────────────────────────────
  const clearForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setMessage(null);
    setShowPassword(false);
  };

  const switchMode = (newMode: Mode) => {
    clearForm();
    setMode(newMode);
  };

  const translateError = (msg: string): string => {
    if (msg.includes('Invalid login credentials'))
      return '❌ Email o contraseña incorrectos. Verifica tus datos.';
    if (msg.includes('Email not confirmed'))
      return '📧 Debes confirmar tu email. Revisa tu bandeja de entrada.';
    if (msg.includes('User already registered'))
      return '⚠️ Ya existe una cuenta con este email. Inicia sesión.';
    if (msg.includes('Password should be'))
      return '⚠️ La contraseña debe tener al menos 6 caracteres.';
    if (msg.includes('Too many requests'))
      return '⏳ Demasiados intentos. Espera unos minutos.';
    if (
      msg.includes('fetch') ||
      msg.includes('network') ||
      msg.includes('Failed')
    )
      return '🌐 Error de conexión. Verifica tu internet.';
    return `Error: ${msg}`;
  };

  // ── LOGIN ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setMessage({ type: 'error', text: 'Completa todos los campos.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Error login:', error);
        setMessage({ type: 'error', text: translateError(error.message) });
        setLoading(false);
        return;
      }

      if (data?.user) {
        console.log('✅ Login exitoso:', data.user.email);
        onLogin(data.user.email ?? '');

        // Pequeña pausa para que el estado se actualice
        setTimeout(() => {
          if (data.user!.email === 'informacion.comeback@gmail.com') {
            onNavigate('admin');
          } else {
            onNavigate('dashboard');
          }
        }, 100);
      }
    } catch (err: any) {
      console.error('❌ Error inesperado:', err);
      setMessage({
        type: 'error',
        text: '🌐 Error de conexión. Verifica tu internet.',
      });
      setLoading(false);
    }
  };

  // ── REGISTRO ─────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'El nombre completo es requerido.' });
      return;
    }
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'El email es requerido.' });
      return;
    }
    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        console.error('❌ Error registro:', error);
        setMessage({ type: 'error', text: translateError(error.message) });
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Guardar en tabla profiles
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
          });
        } catch (profileErr) {
          console.warn('⚠️ Error guardando perfil:', profileErr);
        }

        if (data.session) {
          // Confirmación de email desactivada → login directo
          onLogin(data.user.email ?? '');
          setTimeout(() => onNavigate('dashboard'), 100);
        } else {
          // Confirmación de email activada
          setMessage({
            type: 'success',
            text: '✅ ¡Cuenta creada! Revisa tu email para confirmar tu cuenta. Luego inicia sesión.',
          });
          clearForm();
          setMode('login');
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error('❌ Error inesperado:', err);
      setMessage({
        type: 'error',
        text: '🌐 Error de conexión. Verifica tu internet.',
      });
      setLoading(false);
    }
  };

  // ── RECUPERAR CONTRASEÑA ─────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Ingresa tu email.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: 'https://academiachefrondon.netlify.app' }
      );

      if (error) {
        console.error('❌ Error recuperación:', error);
        setMessage({ type: 'error', text: translateError(error.message) });
        setLoading(false);
        return;
      }

      setMessage({
        type: 'success',
        text: '✅ Email enviado. Revisa tu bandeja de entrada y el spam.',
      });
    } catch (err: any) {
      console.error('❌ Error inesperado:', err);
      setMessage({ type: 'error', text: '🌐 Error de conexión. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-block cursor-pointer group"
          >
            <div className="text-4xl mb-2">🎂</div>
            <h1
              className="text-2xl font-bold text-rose-600 group-hover:text-rose-700 transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Chef Karolain Rondón
            </h1>
            <p className="text-gray-500 text-sm mt-1"
               style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Academia de Pastelería Online
            </p>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Tabs */}
          {mode !== 'forgot' && (
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-rose-600 shadow-sm font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-rose-600 shadow-sm font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Título */}
          <h2
            className="text-xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {mode === 'login'    && '¡Bienvenida de vuelta! 👋'}
            {mode === 'register' && '¡Crea tu cuenta gratuita! 🎉'}
            {mode === 'forgot'   && 'Recuperar contraseña 🔑'}
          </h2>

          {/* Mensaje */}
          {message && (
            <div className={`mb-5 p-4 rounded-xl text-sm font-medium border ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* ══ FORMULARIO LOGIN ══ */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-rose-300
                    focus:border-transparent disabled:opacity-50
                    disabled:cursor-not-allowed transition-all text-gray-800"
                />
              </div>

              {/* Contraseña con ojito */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-rose-300
                      focus:border-transparent disabled:opacity-50
                      disabled:cursor-not-allowed transition-all text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-rose-500 hover:text-rose-700
                    cursor-pointer transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700
                  disabled:bg-rose-300 disabled:cursor-not-allowed
                  text-white font-bold py-3 px-6 rounded-xl
                  transition-all cursor-pointer shadow-md hover:shadow-lg
                  flex items-center justify-center gap-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          )}

          {/* ══ FORMULARIO REGISTRO ══ */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" noValidate>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nombre Completo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                  disabled={loading}
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-rose-300
                    focus:border-transparent disabled:opacity-50
                    disabled:cursor-not-allowed transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-rose-300
                    focus:border-transparent disabled:opacity-50
                    disabled:cursor-not-allowed transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Teléfono / WhatsApp{' '}
                  <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+58 414 000 0000"
                  disabled={loading}
                  autoComplete="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-rose-300
                    focus:border-transparent disabled:opacity-50
                    disabled:cursor-not-allowed transition-all text-gray-800"
                />
              </div>

              {/* Contraseña con ojito */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Contraseña <span className="text-rose-500">*</span>{' '}
                  <span className="text-gray-400 text-xs">(mín. 6 caracteres)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-rose-300
                      focus:border-transparent disabled:opacity-50
                      disabled:cursor-not-allowed transition-all text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700
                  disabled:bg-rose-300 disabled:cursor-not-allowed
                  text-white font-bold py-3 px-6 rounded-xl
                  transition-all cursor-pointer shadow-md hover:shadow-lg
                  flex items-center justify-center gap-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  '¡Crear Cuenta Gratis!'
                )}
              </button>

              <p className="text-xs text-center text-gray-400"
                 style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Al registrarte aceptas nuestros términos de uso.
              </p>
            </form>
          )}

          {/* ══ FORMULARIO RECUPERAR ══ */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700"
                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                📧 Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"
                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-rose-300
                    focus:border-transparent disabled:opacity-50
                    disabled:cursor-not-allowed transition-all text-gray-800"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700
                  disabled:bg-rose-300 disabled:cursor-not-allowed
                  text-white font-bold py-3 px-6 rounded-xl
                  transition-all cursor-pointer shadow-md hover:shadow-lg
                  flex items-center justify-center gap-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    <span>Enviando...</span>
                  </>
                ) : (
                  '📧 Enviar Email de Recuperación'
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full text-sm text-gray-500 hover:text-rose-500
                  cursor-pointer transition-colors py-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ← Volver a Iniciar Sesión
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6"
           style={{ fontFamily: "'Montserrat', sans-serif" }}>
          © 2025 Academia Chef Karolain Rondón · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}