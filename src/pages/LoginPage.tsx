import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onLogin: (email: string) => void;
  onNavigate: (page: string) => void;
}

// Ícono ojo abierto
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Ícono ojo cerrado
const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        // ── LOGIN ──
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Email o contraseña incorrectos. Verifica tus datos.');
          }
          throw signInError;
        }
        onLogin(email);
        onNavigate('dashboard');

      } else {
        // ── REGISTRO ──

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden. Verifícalas.');
        }

        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }

        if (!name.trim()) {
          throw new Error('Por favor ingresa tu nombre completo.');
        }

        // Crear cuenta en Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            throw new Error('Este email ya tiene una cuenta. Inicia sesión.');
          }
          throw signUpError;
        }

        // Guardar perfil en tabla profiles
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: signUpData.user.id,
              full_name: name.trim(),
              email: email.toLowerCase().trim(),
              created_at: new Date().toISOString()
            });

          if (profileError) {
            console.warn('Perfil no guardado:', profileError.message);
          }
        }

        // Verificar si requiere confirmación de email
        if (signUpData.session) {
          // Sesión activa → acceso directo
          onLogin(email);
          onNavigate('dashboard');
        } else {
          // Requiere confirmar email
          setSuccessMsg(
            '¡Cuenta creada! Revisa tu correo para confirmar tu email y luego inicia sesión.'
          );
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }
      }

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con Google.');
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF3C7] to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        {/* Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>K</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {isLogin ? 'Bienvenida de vuelta' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {isLogin ? 'Accede a tus cursos' : 'Comienza tu viaje en repostería'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Mensaje de error */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start space-x-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMsg && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-start space-x-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="cursor-pointer w-full mb-6 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                o con email
              </span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nombre (solo registro) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none disabled:bg-gray-50 transition-all"
                  placeholder="Tu nombre completo"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none disabled:bg-gray-50 transition-all"
                placeholder="tu@email.com"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none disabled:bg-gray-50 transition-all"
                  placeholder="••••••••"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            {/* Confirmar contraseña (solo registro) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none disabled:bg-gray-50 transition-all ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : confirmPassword && password === confirmPassword
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200'
                    }`}
                    placeholder="••••••••"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {/* Indicador de coincidencia */}
                {confirmPassword && (
                  <p className={`text-xs mt-1 font-medium ${
                    password === confirmPassword ? 'text-green-600' : 'text-red-500'
                  }`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {password === confirmPassword
                      ? '✅ Las contraseñas coinciden'
                      : '❌ Las contraseñas no coinciden'}
                  </p>
                )}
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading || (!isLogin && confirmPassword !== '' && password !== confirmPassword)}
              className="cursor-pointer w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}</span>
                </span>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Mi Cuenta'
              )}
            </button>
          </form>

          {/* Cambiar modo */}
          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              disabled={loading}
              className="cursor-pointer text-sm text-gray-600 disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <span className="text-[#FF6B6B] font-bold hover:underline">
                {isLogin ? 'Regístrate gratis' : 'Inicia Sesión'}
              </span>
            </button>
          </div>

          {/* Legal */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Al continuar, aceptas nuestros{' '}
              <button
                onClick={() => onNavigate('terms')}
                className="cursor-pointer text-[#FF6B6B] hover:underline"
              >
                Términos
              </button>{' '}
              y{' '}
              <button
                onClick={() => onNavigate('privacy')}
                className="cursor-pointer text-[#FF6B6B] hover:underline"
              >
                Política de Privacidad
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}