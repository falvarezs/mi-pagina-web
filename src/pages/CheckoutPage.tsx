import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import { supabase } from '../lib/supabaseClient';

interface CheckoutPageProps {
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

type PageState = 'loading' | 'contact' | 'already-purchased';

// ═══════════════════════════════════════════════════════════════════
// ESTILOS INLINE PARA TODOS LOS BOTONES (Safari iOS fix)
// ═══════════════════════════════════════════════════════════════════

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
  fontSize: '17px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 10px 30px -5px rgba(37, 211, 102, 0.5)',
  transition: 'all 0.3s',
  fontFamily: "'Montserrat', sans-serif",
  minHeight: '60px',
  WebkitAppearance: 'none',
  appearance: 'none',
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
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
  textDecoration: 'none',
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
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const backButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: 'transparent',
  color: '#6b7280',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const linkButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 20px',
  backgroundColor: 'transparent',
  color: '#FF6B6B',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
  textDecoration: 'underline',
};

// Icono WhatsApp reutilizable
const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg style={{ width: `${size}px`, height: `${size}px`, flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════

export function CheckoutPage({ courseId, onNavigate }: CheckoutPageProps) {
  const course = courses.find(c => c.id === Number(courseId));
  const [pageState, setPageState] = useState<PageState>('loading');
  const [userName, setUserName] = useState('');
  const [imgError, setImgError] = useState(false);

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
            style={linkButtonStyle}
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
    <div 
      className="min-h-screen w-full overflow-x-hidden bg-gray-50"
      style={{ maxWidth: '100vw' }}
    >

      {/* ══════════════════════════════════════════════════
          BOTÓN VOLVER
      ══════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <button
          onClick={() => onNavigate('course', { slug: course.slug })}
          style={backButtonStyle}
        >
          <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver al curso</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full overflow-x-hidden">

        {/* ═══════════════════════════════════════════════════════════════
            🌑 CUADRO NEGRO ELEGANTE PRINCIPAL
        ═══════════════════════════════════════════════════════════════ */}
        <div 
          className="rounded-3xl overflow-hidden shadow-2xl relative w-full mb-8 sm:mb-10"
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            backgroundColor: '#1F2937',
          }}
        >
          {/* Elementos decorativos */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)' }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-20"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          ></div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">

            {/* Badge superior */}
            <div className="flex justify-center mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-semibold text-green-300">
                  Atención personalizada disponible
                </span>
              </div>
            </div>

            {/* Título */}
            <h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight text-center"
              style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}
            >
              ¡Estás a un paso de{' '}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: '#FF6B6B',
                }}
              >
                comenzar!
              </span>
            </h1>

            {/* Saludo personalizado */}
            <p 
              className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 text-center max-w-xl mx-auto leading-relaxed"
              style={{ wordBreak: 'break-word' }}
            >
              {userName ? `Hola ${userName}, escr` : 'Escr'}íbele directamente a la Chef Karolain por WhatsApp y ella te guiará paso a paso.
            </p>

            {/* Tarjeta de la Chef */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 max-w-md mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <div className="relative flex-shrink-0">
                  {!imgError ? (
                    <img
                      src="/yulia/pagina-principal.jpg"
                      alt="Chef Karolain Rondón"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover object-center shadow-lg border-2 border-white/30"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg border-2 border-white/30"
                      style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)', backgroundColor: '#FF6B6B' }}
                    >
                      👩‍🍳
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-left min-w-0">
                  <p className="text-white font-bold text-sm sm:text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Chef Karolain Rondón
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Chef Pastelera Profesional
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-300 font-medium">
                      En línea ahora
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 💰 CUADRO DEL PRECIO */}
            <div 
              className="rounded-2xl p-5 sm:p-6 mb-6 max-w-md mx-auto border-2 border-white/20"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <p className="text-xs uppercase tracking-widest text-gray-300 mb-2 text-center font-semibold">
                Inversión única
              </p>
              <div className="text-center mb-2">
                <p className="text-sm text-gray-300 mb-1" style={{ fontFamily: "'Montserrat', sans-serif", wordBreak: 'break-word' }}>
                  {course.title}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span 
                    className="text-5xl sm:text-6xl font-bold"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: '#FF6B6B',
                    }}
                  >
                    ${course.price}
                  </span>
                  <span className="text-xl sm:text-2xl text-gray-300 font-bold">USD</span>
                </div>
              </div>
              <p className="text-xs text-center text-gray-400 mb-3">
                Pago único · Acceso de por vida
              </p>
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
                  <span className="text-xs font-bold text-green-300">✓ SIN COMISIONES</span>
                </div>
              </div>
            </div>

            {/* 💬 BOTÓN WHATSAPP GRANDE */}
            <div className="max-w-md mx-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={whatsappButtonStyle}
              >
                <WhatsAppIcon size={28} />
                <span>Escribir a la Chef</span>
              </a>

              <p className="text-xs text-center text-gray-400 mt-3">
                📱 Se abrirá WhatsApp con un mensaje listo para enviar
              </p>
            </div>

            {/* 🎯 BENEFICIOS RÁPIDOS */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-1">⚡</div>
                <p className="text-[10px] sm:text-xs text-gray-300 font-medium leading-tight">Respuesta<br/>rápida</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-1">🔒</div>
                <p className="text-[10px] sm:text-xs text-gray-300 font-medium leading-tight">Pago<br/>seguro</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-1">💯</div>
                <p className="text-[10px] sm:text-xs text-gray-300 font-medium leading-tight">Acceso<br/>de por vida</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            💳 MÉTODOS DE PAGO
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 lg:p-8 mb-8 sm:mb-10 border border-gray-100">
          <div className="text-center mb-5 sm:mb-6">
            <h3 className="font-bold text-gray-900 text-xl sm:text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              💳 Métodos de Pago Disponibles
            </h3>
            <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              La Chef te indicará los datos exactos según tu país y preferencia
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">

            <div className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-red-50 border border-red-100 rounded-xl text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl sm:text-3xl">
                📱
              </div>
              <p className="font-bold text-gray-800 text-sm sm:text-base">Pago Móvil</p>
              <p className="text-xs text-gray-500">Transferencia en bolívares</p>
              <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">Bs.</span>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl sm:text-3xl">
                🏦
              </div>
              <p className="font-bold text-gray-800 text-sm sm:text-base">Zelle</p>
              <p className="text-xs text-gray-500">Transferencia bancaria USA</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">USD</span>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-yellow-50 border border-yellow-100 rounded-xl text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl sm:text-3xl">
                💰
              </div>
              <p className="font-bold text-gray-800 text-sm sm:text-base">USDT / Binance</p>
              <p className="text-xs text-gray-500">Cripto · Internacional</p>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">Crypto</span>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            🚀 ¿CÓMO FUNCIONA?
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-br from-[#FF6B6B]/5 to-[#F59E0B]/5 rounded-2xl p-5 sm:p-6 lg:p-8 mb-8 sm:mb-10 border border-[#FF6B6B]/10">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="font-bold text-gray-900 text-xl sm:text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              🚀 ¿Cómo funciona?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Solo 4 pasos para empezar tu curso
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5 max-w-2xl mx-auto">
            {[
              { num: '1', title: 'Escríbele a la Chef', desc: 'Haz clic en el botón verde y envía el mensaje por WhatsApp', emoji: '💬' },
              { num: '2', title: 'Coordina tu pago', desc: 'La Chef te indica los datos según tu método preferido', emoji: '💳' },
              { num: '3', title: 'Realiza la transferencia', desc: 'Paga de forma segura con el método que más te convenga', emoji: '💸' },
              { num: '4', title: '¡Accede a tu curso!', desc: 'La Chef activa tu acceso y puedes empezar inmediatamente', emoji: '🎉' }
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3 sm:gap-4 bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm sm:text-base"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)', backgroundColor: '#FF6B6B' }}
                >
                  {step.num}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-800 text-base sm:text-lg mb-1" style={{ wordBreak: 'break-word' }}>
                    {step.emoji} {step.title}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed" style={{ wordBreak: 'break-word' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ⭐ TESTIMONIOS
        ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-8 sm:mb-10">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              ⭐ Lo que dicen nuestras estudiantes
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Testimonios Reales
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {testimonios.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-5 sm:p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%)', backgroundColor: '#FEF3C7' }}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm sm:text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {t.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      📍 {t.ciudad}
                    </p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed italic" style={{ wordBreak: 'break-word' }}>
                  "{t.mensaje}"
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div 
            className="rounded-2xl p-5 sm:p-6 text-center text-white shadow-md mt-6"
            style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)', backgroundColor: '#FF6B6B' }}
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  4.9
                </p>
                <p className="text-[10px] sm:text-xs opacity-90 uppercase tracking-wider">Calificación</p>
              </div>
              <div className="border-l border-r border-white/30">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  1k+
                </p>
                <p className="text-[10px] sm:text-xs opacity-90 uppercase tracking-wider">Estudiantes</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  98%
                </p>
                <p className="text-[10px] sm:text-xs opacity-90 uppercase tracking-wider">Satisfacción</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}