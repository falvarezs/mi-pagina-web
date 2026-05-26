import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import { supabase } from '../lib/supabaseClient';

interface CheckoutPageProps {
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

type PageState = 'loading' | 'contact' | 'already-purchased';

// ── Estilos inline de respaldo (Safari iOS fix) ──────────────
const whatsappButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  width: '100%',
  padding: '18px 24px',
  backgroundColor: '#25D366',
  color: '#ffffff',
  fontWeight: 700,
  borderRadius: '16px',
  fontSize: '18px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s',
  fontFamily: "'Montserrat', sans-serif",
  minHeight: '56px',
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  backgroundColor: '#FF6B6B',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  minHeight: '44px',
  transition: 'all 0.2s',
};

const secondaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  fontWeight: 600,
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  minHeight: '44px',
  transition: 'all 0.2s',
};

export function CheckoutPage({ courseId, onNavigate }: CheckoutPageProps) {
  const course = courses.find(c => c.id === Number(courseId));
  const [pageState, setPageState] = useState<PageState>('loading');
  const [userName, setUserName] = useState('');

  const WHATSAPP_NUMBER = '584241055470';

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const userId = data.session.user.id;
          const userEmail = data.session.user.email ?? '';

          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', userId)
            .maybeSingle();

          if (profile?.full_name) {
            setUserName(profile.full_name);
          } else {
            setUserName(userEmail.split('@')[0]);
          }

          const { data: existingPurchase } = await supabase
            .from('purchases')
            .select('id, status')
            .eq('user_id', userId)
            .eq('course_id', Number(courseId))
            .maybeSingle();

          if (
            existingPurchase &&
            (existingPurchase.status === 'approved' ||
              existingPurchase.status === 'pending')
          ) {
            setPageState('already-purchased');
            return;
          }
        }
        setPageState('contact');
      } catch {
        setPageState('contact');
      }
    };

    loadSession();
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Curso no encontrado
          </h2>
          <button
            onClick={() => onNavigate('courses')}
            className="cursor-pointer text-[#FF6B6B] hover:underline font-semibold"
          >
            Ver todos los cursos
          </button>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `¡Hola Chef Karolain! 👋\n\nEstoy interesado/a en inscribirme en el curso:\n\n📚 *${course.title}*\n💰 Precio: $${course.price} USD\n\n¿Me puedes indicar cómo realizar el pago? 😊`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const testimonios = [
    {
      nombre: 'María Fernanda',
      ciudad: 'Caracas, Venezuela',
      mensaje: 'El mejor curso que he tomado. Aprendí a hacer postres sin azúcar refinada que mi familia ama. La Chef explica todo súper claro.',
      rating: 5,
      avatar: '👩🏻'
    },
    {
      nombre: 'Andrea Gómez',
      ciudad: 'Caracas, Venezuela',
      mensaje: '¡Increíble! Ya estoy vendiendo mis postres saludables. La inversión se paga sola con las primeras ventas. 100% recomendado.',
      rating: 5,
      avatar: '👩🏽'
    },
    {
      nombre: 'Luisa Pérez',
      ciudad: 'Caracas, Venezuela',
      mensaje: 'La atención de la Chef es excepcional. Te responde dudas por WhatsApp. Los videos son de altísima calidad. ¡Vale cada centavo!',
      rating: 5,
      avatar: '👩🏼'
    }
  ];

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Preparando tu inscripción...</p>
        </div>
      </div>
    );
  }

  if (pageState === 'already-purchased') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Ya tienes este curso!
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-8">
              Ya tienes una inscripción activa para <strong>{course.title}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => onNavigate('dashboard')}
                style={primaryButtonStyle}
              >
                Ir a Mi Panel
              </button>
              <button
                onClick={() => onNavigate('home')}
                style={secondaryButtonStyle}
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-white via-[#FEF3C7]/20 to-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <button
          onClick={() => onNavigate('course', { slug: course.slug })}
          className="cursor-pointer inline-flex items-center text-gray-500 hover:text-[#FF6B6B] transition-colors font-medium text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al curso
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ══ COLUMNA IZQUIERDA ══ */}
          <div>

            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 sm:px-4 py-2 mb-5 sm:mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs sm:text-sm font-semibold text-green-700">
                Atención personalizada disponible
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ¡Estás a un paso de{' '}
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: '#FF6B6B'
                }}
              >
                comenzar!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {userName ? `Hola ${userName}, e` : 'E'}l proceso es muy sencillo: escríbele directamente a la Chef Karolain por WhatsApp y ella te guiará paso a paso para completar tu inscripción de forma segura y personalizada.
            </p>

            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 flex items-center gap-4 sm:gap-5 border border-gray-100">
              <div className="relative flex-shrink-0">
                <img
                  src="/yulia/pagina-principal.jpg"
                  alt="Chef Karolain Rondón"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-center shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-base sm:text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Chef Karolain Rondón
                </p>
                <p className="text-gray-500 text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Chef Pastelera Profesional
                </p>
                <div className="flex items-center mt-1 flex-wrap gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">+1,000 estudiantes</span>
                </div>
              </div>
            </div>

            {/* BOTÓN WHATSAPP - VISIBLE EN SAFARI */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={whatsappButtonStyle}
            >
              <svg style={{ width: '28px', height: '28px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>Escribir a la Chef</span>
            </a>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              📱 Se abrirá WhatsApp con un mensaje listo para enviar
            </p>

            {/* TESTIMONIOS */}
            <div className="space-y-4">
              <div className="text-center mb-5">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  ⭐ Lo que dicen nuestras estudiantes
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Testimonios Reales
                </h3>
              </div>

              {testimonios.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%)' }}
                    >
                      {t.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm sm:text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {t.nombre}
                        </p>
                        <div className="flex gap-0.5">
                          {[...Array(t.rating)].map((_, j) => (
                            <svg key={j} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        📍 {t.ciudad}
                      </p>

                      <p className="text-sm text-gray-700 leading-relaxed italic" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        "{t.mensaje}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div 
                className="rounded-2xl p-4 sm:p-5 text-center text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)', backgroundColor: '#FF6B6B' }}
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      4.9
                    </p>
                    <p className="text-[10px] sm:text-xs opacity-90 uppercase tracking-wider">Calificación</p>
                  </div>
                  <div className="border-l border-r border-white/30">
                    <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      1k+
                    </p>
                    <p className="text-[10px] sm:text-xs opacity-90 uppercase tracking-wider">Estudiantes</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      98%
                    </p>
                    <p className="text-[10px] sm:text-xs opacity-90 uppercase tracking-wider">Satisfacción</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ══ COLUMNA DERECHA ══ */}
          <div className="space-y-5 sm:space-y-6">

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="relative">
                <div className="w-full h-40 sm:h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <p className="text-white font-bold text-lg sm:text-xl leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {course.title}
                  </p>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Precio del curso</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ${course.price}{' '}
                      <span className="text-base sm:text-lg text-gray-500 font-normal">USD</span>
                    </p>
                    <p className="text-xs text-gray-400">Pago único · Acceso de por vida</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-center flex-shrink-0">
                    <p className="text-[10px] sm:text-xs text-green-700 font-bold leading-tight">SIN</p>
                    <p className="text-[10px] sm:text-xs text-green-700 font-bold leading-tight">COMISIONES</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    '✅ Acceso inmediato tras confirmación',
                    '✅ Videos disponibles de por vida',
                    '✅ Certificado de finalización',
                    '✅ Actualizaciones gratuitas',
                    '✅ Soporte personalizado'
                  ].map((item, i) => (
                    <p key={i} className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-base sm:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                💳 Métodos de Pago Disponibles
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                La Chef te indicará los datos exactos según tu país y preferencia:
              </p>
              <div className="space-y-3">

                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-lg sm:text-xl">
                    📱
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm">Pago Móvil</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">Transferencia en bolívares</p>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold flex-shrink-0">Bs.</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-lg sm:text-xl">
                    🏦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm">Zelle</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">Transferencia bancaria USA</p>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold flex-shrink-0">USD</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 text-lg sm:text-xl">
                    💰
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm">USDT / Binance</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">Cripto · Internacional</p>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold flex-shrink-0">Crypto</span>
                </div>

              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FF6B6B]/5 to-[#F59E0B]/5 rounded-2xl p-5 sm:p-6 border border-[#FF6B6B]/10">
              <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                🚀 ¿Cómo funciona?
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { num: '1', title: 'Escríbele a la Chef', desc: 'Haz clic en el botón verde y envía el mensaje por WhatsApp' },
                  { num: '2', title: 'Coordina tu pago', desc: 'La Chef te indica los datos según tu método preferido' },
                  { num: '3', title: 'Realiza la transferencia', desc: 'Paga de forma segura con el método que más te convenga' },
                  { num: '4', title: '¡Accede a tu curso!', desc: 'La Chef activa tu acceso y puedes empezar inmediatamente' }
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-3 sm:gap-4">
                    <div 
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs sm:text-sm"
                      style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)', backgroundColor: '#FF6B6B' }}
                    >
                      {step.num}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">{step.title}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { icon: '🔒', title: 'Pago Seguro', desc: 'Coordinado con la Chef' },
              { icon: '⚡', title: 'Acceso Rápido', desc: 'Activación inmediata' },
              { icon: '🌍', title: 'Internacional', desc: 'Cualquier país' },
              { icon: '💬', title: 'Atención Real', desc: 'Hablas con la Chef' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl mb-2">{item.icon}</span>
                <p className="font-bold text-gray-900 text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {item.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}