import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ResetPasswordPageProps {
  onNavigate: (page: string) => void;
}

// ── Iconos ──────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ── Estilo botón con fix Safari iOS ─────────────────────────────────
const buttonPrimaryStyle: React.CSSProperties = {
  backgroundColor: '#f43f5e',
  color: '#ffffff',
  fontWeight: 700,
  width: '100%',
  padding: '14px 24px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '48px',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
};

// ═══════════════════════════════════════════════════════════════════
// TRADUCTOR DE ERRORES DE SUPABASE AL ESPAÑOL
// ═══════════════════════════════════════════════════════════════════
const traducirError = (mensaje: string): string => {
  const msg = mensaje.toLowerCase();

  // Errores de contraseña
  if (msg.includes('new password should be different from the old password')) {
    return '⚠️ La nueva contraseña debe ser diferente a la anterior.';
  }
  if (msg.includes('password should be at least')) {
    return '⚠️ La contraseña debe tener al menos 6 caracteres.';
  }
  if (msg.includes('password is too short') || msg.includes('weak password')) {
    return '⚠️ La contraseña es muy corta o débil. Usa al menos 6 caracteres.';
  }
  if (msg.includes('password should contain')) {
    return '⚠️ La contraseña debe contener letras y números.';
  }

  // Errores de sesión / token
  if (msg.includes('invalid token') || msg.includes('token expired') || msg.includes('jwt expired')) {
    return '⏱️ El enlace expiró. Solicita uno nuevo desde "Olvidaste tu contraseña".';
  }
  if (msg.includes('session not found') || msg.includes('no session')) {
    return '⚠️ La sesión expiró. Solicita un nuevo enlace.';
  }
  if (msg.includes('invalid login credentials')) {
    return '❌ Email o contraseña incorrectos.';
  }

  // Errores de conexión
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
    return '🌐 Error de conexión. Verifica tu internet e intenta de nuevo.';
  }

  // Errores de rate limit
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return '⏳ Demasiados intentos. Espera unos minutos e intenta de nuevo.';
  }

  // Errores de email
  if (msg.includes('user not found') || msg.includes('email not found')) {
    return '❌ No existe una cuenta con ese email.';
  }
  if (msg.includes('email already')) {
    return '⚠️ Este email ya está registrado.';
  }
  if (msg.includes('invalid email')) {
    return '⚠️ El formato del email no es válido.';
  }

  // Errores generales
  if (msg.includes('unauthorized')) {
    return '🔒 No tienes autorización. El enlace puede haber expirado.';
  }
  if (msg.includes('forbidden')) {
    return '🚫 Acceso denegado.';
  }

  // Si no encontramos traducción, mostrar mensaje genérico
  return `❌ Ocurrió un error: ${mensaje}`;
};

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [validating, setValidating]           = useState(true);
  const [validSession, setValidSession]       = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // ═══════════════════════════════════════════════════════════════════
  // Procesar el token del hash MANUALMENTE
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const handleRecoveryToken = async () => {
      try {
        console.log('🔍 Iniciando validación de token...');

        const hash = window.location.hash;

        if (!hash || !hash.includes('access_token')) {
          setMessage({
            type: 'error',
            text: '❌ No se encontró un token de recuperación. Solicita un nuevo enlace.',
          });
          setValidSession(false);
          setValidating(false);
          return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');

        if (type !== 'recovery') {
          setMessage({
            type: 'error',
            text: '❌ El enlace no es válido para recuperar contraseña.',
          });
          setValidSession(false);
          setValidating(false);
          return;
        }

        if (!accessToken || !refreshToken) {
          setMessage({
            type: 'error',
            text: '❌ El enlace está incompleto. Solicita un nuevo enlace.',
          });
          setValidSession(false);
          setValidating(false);
          return;
        }

        console.log('⏳ Estableciendo sesión con tokens...');
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('❌ Error al establecer sesión:', error);
          setMessage({
            type: 'error',
            text: traducirError(error.message),
          });
          setValidSession(false);
          setValidating(false);
          return;
        }

        if (data.session) {
          console.log('✅ Sesión establecida correctamente:', data.session.user.email);
          setValidSession(true);
        } else {
          setMessage({
            type: 'error',
            text: '❌ No se pudo validar el enlace. Intenta de nuevo.',
          });
          setValidSession(false);
        }
      } catch (err: any) {
        console.error('❌ Error inesperado:', err);
        setMessage({
          type: 'error',
          text: '🌐 Error de conexión. Intenta de nuevo.',
        });
        setValidSession(false);
      } finally {
        setValidating(false);
      }
    };

    handleRecoveryToken();
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // Cambiar contraseña - CON TRADUCCIÓN DE ERRORES
  // ═══════════════════════════════════════════════════════════════════
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage({ type: 'error', text: '⚠️ La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: '⚠️ Las contraseñas no coinciden.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('⏳ Cambiando contraseña...');
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('❌ Error cambiando contraseña:', error);
        // ✨ AQUÍ está la magia: traducimos el error
        setMessage({
          type: 'error',
          text: traducirError(error.message),
        });
        setLoading(false);
        return;
      }

      console.log('✅ Contraseña cambiada correctamente');

      // ─── MARCAR COMO CAMBIADA ────────────────────────────────
      setPasswordChanged(true);
      setLoading(false);

      // Cerrar sesión silenciosamente en background
      supabase.auth.signOut().catch(err => {
        console.warn('Error al cerrar sesión:', err);
      });

    } catch (err: any) {
      console.error('❌ Error inesperado:', err);
      setMessage({ type: 'error', text: '🌐 Error de conexión. Intenta de nuevo.' });
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // Acción manual: Ir al login limpiando todo
  // ═══════════════════════════════════════════════════════════════════
  const handleGoToLogin = () => {
    console.log('🚪 Redirigiendo al login...');
    window.history.replaceState(null, '', window.location.pathname);
    window.location.href = window.location.origin + '/';
  };

  // ── Pantalla de validación inicial ───────────────────────────────
  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Validando enlace de recuperación...
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // Pantalla de ÉXITO - después de cambiar password
  // ═══════════════════════════════════════════════════════════════════
  if (passwordChanged) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Contraseña Actualizada! 🎉
            </h2>

            <p className="text-gray-600 mb-6 text-sm sm:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Tu contraseña se cambió correctamente.
              <br />
              Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>

            <button
              onClick={handleGoToLogin}
              style={buttonPrimaryStyle}
            >
              🔐 Ir a Iniciar Sesión
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            © 2025 Academia Chef Karolain Rondón
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-3xl sm:text-4xl mb-2">🔑</div>
          <h1 className="text-xl sm:text-2xl font-bold text-rose-600" style={{ fontFamily: "'Playfair Display', serif" }}>
            Restablecer Contraseña
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Chef Karolain Rondón · Academia
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">

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

          {/* Si el enlace es válido → mostrar formulario */}
          {validSession ? (
            <>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Crea tu nueva contraseña 🔒
              </h2>
              <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Escribe una contraseña segura de al menos 6 caracteres.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                {/* Nueva contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Nueva Contraseña <span className="text-rose-500">*</span>
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
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent disabled:opacity-50 transition-all text-gray-800"
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                      tabIndex={-1}
                      style={{ background: 'transparent', border: 'none', WebkitAppearance: 'none', appearance: 'none' }}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Confirmar Contraseña <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent disabled:opacity-50 transition-all text-gray-800"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Validación visual */}
                {password && confirmPassword && (
                  <div className={`text-xs font-medium ${
                    password === confirmPassword ? 'text-green-600' : 'text-red-600'
                  }`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {password === confirmPassword ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden'}
                  </div>
                )}

                {/* Botón guardar */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...buttonPrimaryStyle,
                    backgroundColor: loading ? '#fda4af' : '#f43f5e',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    '🔒 Guardar Nueva Contraseña'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Si el enlace NO es válido → botón para volver */
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-4">⚠️</div>
              <p className="text-gray-600 text-sm sm:text-base mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Por favor solicita un nuevo enlace de recuperación desde la página de inicio de sesión.
              </p>
              <button
                onClick={handleGoToLogin}
                style={buttonPrimaryStyle}
              >
                ← Volver al Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          © 2025 Academia Chef Karolain Rondón
        </p>
      </div>
    </div>
  );
}