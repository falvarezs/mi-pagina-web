import { useState, useEffect } from 'react';
import { getCourseBySlug } from '../data/courses';
import { supabase } from '../lib/supabaseClient';

interface CourseDetailPageProps {
  slug: string;
  onNavigate: (page: string, data?: any) => void;
}

type PurchaseStatus = 'loading' | 'not-purchased' | 'pending' | 'approved' | 'rejected';

// ═══════════════════════════════════════════════════════════════════
// ESTILOS INLINE PARA TODOS LOS BOTONES (Safari iOS fix)
// ═══════════════════════════════════════════════════════════════════

const greenButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '16px 24px',
  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  backgroundColor: '#10B981',
  color: '#ffffff',
  fontWeight: 700,
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'center',
  transition: 'all 0.3s',
  minHeight: '48px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '16px 24px',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
  backgroundColor: '#FF6B6B',
  color: '#ffffff',
  fontWeight: 700,
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'center',
  transition: 'all 0.3s',
  minHeight: '48px',
  boxShadow: '0 10px 25px -5px rgba(255, 107, 107, 0.4)',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

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

const amberButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '12px 24px',
  backgroundColor: '#F59E0B',
  color: '#ffffff',
  fontWeight: 700,
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'center',
  transition: 'all 0.3s',
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const textLinkStyle: React.CSSProperties = {
  color: '#f43f5e',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: '4px 0',
  fontSize: '14px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const breadcrumbButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '4px 8px',
  cursor: 'pointer',
  color: '#4b5563',
  fontSize: '14px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const accordionButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '14px 16px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  gap: '8px',
  minHeight: '48px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const socialButtonStyle = (bgColor: string): React.CSSProperties => ({
  width: '44px',
  height: '44px',
  backgroundColor: bgColor,
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  textDecoration: 'none',
  color: '#ffffff',
  flexShrink: 0,
});

// ═══════════════════════════════════════════════════════════════════
// REDES SOCIALES DE LA CHEF
// ═══════════════════════════════════════════════════════════════════
const INSTAGRAM_URL = 'https://instagram.com/comeback.pasteleria';
const WHATSAPP_NUMBER = '584241055470';

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg style={{ width: `${size}px`, height: `${size}px`, flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export function CourseDetailPage({ slug, onNavigate }: CourseDetailPageProps) {
  const course = getCourseBySlug(slug);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>('loading');
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;

        if (!userId || !course) {
          setPurchaseStatus('not-purchased');
          return;
        }

        const { data: purchase } = await supabase
          .from('purchases')
          .select('id, status')
          .eq('user_id', userId)
          .eq('course_id', course.id)
          .maybeSingle();

        if (!purchase) {
          setPurchaseStatus('not-purchased');
        } else if (purchase.status === 'approved') {
          setPurchaseStatus('approved');
        } else if (purchase.status === 'rejected') {
          setPurchaseStatus('rejected');
        } else {
          setPurchaseStatus('pending');
        }
      } catch {
        setPurchaseStatus('not-purchased');
      }
    };

    checkPurchase();
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 w-full overflow-x-hidden">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
          <button
            onClick={() => onNavigate('courses')}
            style={textLinkStyle}
          >
            Ver todos los cursos
          </button>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  // ═══════════════════════════════════════════════════════════════════
  // FUNCIONES DE COMPARTIR
  // ═══════════════════════════════════════════════════════════════════
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareWhatsAppMessage = encodeURIComponent(
    `¡Mira este curso de pastelería de Chef Karolain Rondón! 🍰\n\n${course.title}\n\n${currentUrl}`
  );
  const shareWhatsAppUrl = `https://wa.me/?text=${shareWhatsAppMessage}`;
  const shareFacebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = currentUrl;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        alert('No se pudo copiar el enlace');
      }
      document.body.removeChild(textarea);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // CUADRO NEGRO ELEGANTE - SE MUESTRA SEGÚN EL ESTADO DE COMPRA
  // ═══════════════════════════════════════════════════════════════════
  const renderPurchasePanel = () => {

    if (purchaseStatus === 'loading') {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 text-center">
          <div className="w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }

    // ═══ ESTADO: APROBADO ═══
    if (purchaseStatus === 'approved') {
      return (
        <div 
          className="rounded-3xl overflow-hidden shadow-2xl relative w-full"
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            backgroundColor: '#1F2937',
          }}
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-20"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          ></div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-5">
              <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-green-300">
                Curso Activado
              </span>
            </div>

            <h2 
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}
            >
              ¡Ya tienes este curso! 🎉
            </h2>

            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
              Tu pago fue aprobado. Puedes acceder a todos los videos ahora mismo.
            </p>

            <div className="max-w-md mx-auto">
              <button
                onClick={() => onNavigate('watch-course', { courseId: String(course.id) })}
                style={greenButtonStyle}
              >
                ▶ Ver Curso Ahora
              </button>
              <p className="text-xs text-gray-400 mt-3">
                🎉 Tienes acceso de por vida a este curso
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ═══ ESTADO: PENDIENTE ═══
    if (purchaseStatus === 'pending') {
      return (
        <div 
          className="rounded-3xl overflow-hidden shadow-2xl relative w-full"
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            backgroundColor: '#1F2937',
          }}
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
          ></div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-2 mb-5">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-amber-300">
                Pago en Revisión
              </span>
            </div>

            <h2 
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}
            >
              Pago en Verificación
            </h2>

            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
              Ya enviaste tu comprobante. Estamos verificando tu pago en las próximas 24-48 horas hábiles.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 max-w-md mx-auto border border-white/20">
              <ul className="space-y-2 text-sm text-gray-300 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5 flex-shrink-0">→</span>
                  <span>Recibirás un email cuando sea aprobado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5 flex-shrink-0">→</span>
                  <span>No es necesario enviar el comprobante de nuevo</span>
                </li>
              </ul>
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={() => onNavigate('dashboard')}
                style={amberButtonStyle}
              >
                Ver estado en Mi Panel
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ═══ ESTADO: RECHAZADO ═══
    if (purchaseStatus === 'rejected') {
      return (
        <div 
          className="rounded-3xl overflow-hidden shadow-2xl relative w-full"
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            backgroundColor: '#1F2937',
          }}
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20"
            style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
          ></div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2 mb-5">
              <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-red-300">
                Pago Rechazado
              </span>
            </div>

            <h2 
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}
            >
              Tu pago fue rechazado
            </h2>

            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
              El comprobante que enviaste no pudo ser verificado. Puedes enviar uno nuevo.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 max-w-md mx-auto border border-white/20">
              <p className="text-xs font-bold text-red-300 mb-2 text-left">Razones comunes:</p>
              <ul className="space-y-1 text-xs text-gray-300 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">→</span>
                  <span>El comprobante no es legible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">→</span>
                  <span>El monto no corresponde al precio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">→</span>
                  <span>Los datos del destinatario no coinciden</span>
                </li>
              </ul>
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={() => onNavigate('checkout', { courseId: String(course.id) })}
                style={primaryButtonStyle}
              >
                🔄 Enviar Nuevo Comprobante
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ═══ ESTADO: SIN COMPRA (PRINCIPAL) - CUADRO NEGRO ELEGANTE ═══
    return (
      <div 
        className="rounded-3xl overflow-hidden shadow-2xl relative w-full"
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
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight text-center"
            style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}
          >
            ¿Listo para comenzar tu{' '}
            <span 
              style={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#FF6B6B',
              }}
            >
              transformación?
            </span>
          </h2>

          {/* Descripción */}
          <p 
            className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 text-center max-w-2xl mx-auto leading-relaxed"
            style={{ wordBreak: 'break-word' }}
          >
            Habla directamente con la Chef Karolain por WhatsApp.
            Te guiará personalmente para que comiences tu camino en la repostería profesional.
          </p>

          {/* Tarjeta de la Chef */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-6 max-w-md mx-auto border border-white/20">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {!imgError ? (
                <img
                  src="/yulia/foto2.jpg"
                  alt="Chef Karolain"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border-2 border-white/30 flex-shrink-0"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white/30 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)' }}
                >
                  👩‍🍳
                </div>
              )}
              <div className="text-left min-w-0">
                <p className="text-white font-bold text-sm sm:text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Chef Karolain Rondón
                </p>
                <p className="text-gray-300 text-xs sm:text-sm">
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
                <span className="text-xl sm:text-2xl text-gray-300 font-bold">{course.currency}</span>
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

          {/* 💬 BOTÓN WHATSAPP - VA AL CHECKOUT */}
          <div className="max-w-md mx-auto">
            <button
              onClick={() => onNavigate('checkout', { courseId: String(course.id) })}
              style={whatsappButtonStyle}
            >
              <WhatsAppIcon size={26} />
              <span>Comunícate con la Chef</span>
            </button>

            <p className="text-xs text-center text-gray-400 mt-3">
              📱 Coordina tu pago de forma segura
            </p>
          </div>

          {/* 🎯 BENEFICIOS */}
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
    );
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 w-full overflow-x-hidden"
      style={{ maxWidth: '100vw' }}
    >

      {/* BREADCRUMB */}
      <div className="bg-white border-b w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center text-sm text-gray-600 flex-wrap gap-1">
            <button onClick={() => onNavigate('home')} style={breadcrumbButtonStyle} className="hover:text-[#FF6B6B]">
              Inicio
            </button>
            <span className="text-gray-400">/</span>
            <button onClick={() => onNavigate('courses')} style={breadcrumbButtonStyle} className="hover:text-[#FF6B6B]">
              Cursos
            </button>
            <span className="text-gray-400">/</span>
            <span 
              className="text-gray-900 truncate" 
              style={{ maxWidth: '180px', wordBreak: 'break-word' }}
            >
              {course.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full overflow-x-hidden">

        {/* TRAILER */}
        <div 
          className="bg-black rounded-2xl overflow-hidden shadow-xl mb-6 sm:mb-8 w-full"
          style={{ 
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            maxWidth: '100%',
          }}
        >
          <iframe
            src={course.trailerUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
              maxWidth: '100%',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`Trailer ${course.title}`}
          />
        </div>

        {/* Info del curso */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 mb-6 sm:mb-8 w-full overflow-hidden">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" 
            style={{ 
              fontFamily: "'Playfair Display', serif",
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{course.rating}</span>
              <span className="ml-1">({course.reviewsCount} reseñas)</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{course.studentsCount} estudiantes</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.duration} de contenido</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{totalLessons} lecciones</span>
            </div>
          </div>
          <p 
            className="text-base sm:text-lg text-gray-700 leading-relaxed" 
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            {course.fullDescription}
          </p>
        </div>

        {/* Qué aprenderás */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 mb-6 sm:mb-8 w-full overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}>
            ¿Qué aprenderás?
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {course.whatYouLearn.map((item, idx) => (
              <div key={idx} className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span 
                  className="text-sm sm:text-base text-gray-700"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 mb-6 sm:mb-8 w-full overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}>
            Contenido del Curso
          </h2>
          <div className="space-y-3">
            {course.modules.map((module) => (
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  style={accordionButtonStyle}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center min-w-0 flex-1 gap-2 sm:gap-3">
                    <svg className={`w-5 h-5 transition-transform flex-shrink-0 ${openModules.includes(module.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span 
                      className="font-semibold text-gray-900 text-sm sm:text-base text-left"
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}
                    >
                      {module.title}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap flex-shrink-0">{module.lessons.length} lecc.</span>
                </button>
                {openModules.includes(module.id) && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 last:border-b-0 gap-2">
                        <div className="flex items-center min-w-0 flex-1">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span 
                            className="text-sm sm:text-base text-gray-700 truncate"
                            style={{ minWidth: 0 }}
                          >
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap flex-shrink-0">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Qué incluye */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 mb-6 sm:mb-8 w-full overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}>
            Qué incluye este curso
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {course.includes.map((item, idx) => (
              <div key={idx} className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B6B] mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span 
                  className="text-sm sm:text-base text-gray-700"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructora */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 w-full overflow-hidden mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}>
            Tu Instructora
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            {!imgError ? (
              <img
                src="/yulia/foto2.jpg"
                alt="Chef Karolain Rondón"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover object-center flex-shrink-0 shadow-md"
                onError={() => setImgError(true)}
              />
            ) : (
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl shadow-md flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)', backgroundColor: '#FF6B6B', color: '#ffffff' }}
              >
                👩‍🍳
              </div>
            )}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif", wordBreak: 'break-word' }}>
                Chef Karolain Rondón
              </h3>
              <p 
                className="text-sm sm:text-base text-gray-600 leading-relaxed"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                Chef pastelera venezolana con 15 años de experiencia (8 profesional).
                Graduada del Instituto Venezolano Gastronómico (2018) y formada en
                hoteles como Pestana Caracas, Altamira Village y Waldorf. Enseña con
                paciencia, bases sólidas y práctica guiada para todos los niveles.
              </p>
              <button
                onClick={() => onNavigate('about')}
                style={{ ...textLinkStyle, marginTop: '16px', display: 'inline-block' }}
              >
                Ver perfil completo →
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            🌑 CUADRO NEGRO ELEGANTE - ÚNICA VEZ AL FINAL
        ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-6 sm:mb-8">
          {renderPurchasePanel()}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            COMPARTIR
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 w-full overflow-hidden">
          <p className="text-sm text-gray-600 mb-4 text-center font-medium">
            📢 Comparte este curso:
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            
            <a
              href={shareWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={socialButtonStyle('#25D366')}
              title="Compartir por WhatsApp"
              aria-label="Compartir por WhatsApp"
            >
              <WhatsAppIcon size={20} />
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={socialButtonStyle('#E1306C')}
              title="Ver Instagram de la Chef"
              aria-label="Instagram de la Chef"
            >
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

            <a
              href={shareFacebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={socialButtonStyle('#1877F2')}
              title="Compartir en Facebook"
              aria-label="Compartir en Facebook"
            >
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <button
              onClick={handleCopyLink}
              style={socialButtonStyle(copiedLink ? '#10B981' : '#6b7280')}
              title="Copiar enlace"
              aria-label="Copiar enlace"
            >
              {copiedLink ? (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              )}
            </button>
          </div>

          {copiedLink && (
            <p className="text-xs text-green-600 text-center mt-3 font-semibold">
              ✅ ¡Enlace copiado!
            </p>
          )}
        </div>

      </div>
    </div>
  );
}