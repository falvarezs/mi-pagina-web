import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import { supabase } from '../lib/supabaseClient';

interface CheckoutPageProps {
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

type PageState = 'loading' | 'contact' | 'already-purchased';

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

          // Obtener nombre del perfil
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

          // Verificar si ya tiene compra aprobada o pendiente
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
      <div className="min-h-screen flex items-center justify-center">
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

  // Mensaje pre-escrito para WhatsApp
  const whatsappMessage = encodeURIComponent(
    `¡Hola Chef Karolain! 👋\n\nEstoy interesado/a en inscribirme en el curso:\n\n📚 *${course.title}*\n💰 Precio: $${course.price} USD\n\n¿Me puedes indicar cómo realizar el pago? 😊`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  // ── Cargando ──
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Preparando tu inscripción...</p>
        </div>
      </div>
    );
  }

  // ── Ya tiene el curso ──
  if (pageState === 'already-purchased') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Ya tienes este curso!
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Ya tienes una inscripción activa para <strong>{course.title}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('dashboard')}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Ir a Mi Panel
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="cursor-pointer px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Página principal de contacto ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FEF3C7]/20 to-white">

      {/* Botón volver */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <button
          onClick={() => onNavigate('course', { slug: course.slug })}
          className="cursor-pointer flex items-center text-gray-500 hover:text-[#FF6B6B] transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al curso
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── COLUMNA IZQUIERDA: Mensaje y WhatsApp ── */}
          <div>

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">
                Atención personalizada disponible
              </span>
            </div>

            {/* Título */}
            <h1
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ¡Estás a un paso de{' '}
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] bg-clip-text text-transparent">
                comenzar!
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {userName ? `Hola ${userName}, e` : 'E'}l proceso es muy sencillo: escríbele directamente a la Chef Karolain por WhatsApp y ella te guiará paso a paso para completar tu inscripción de forma segura y personalizada.
            </p>

            {/* Card Chef */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex items-center space-x-5 border border-gray-100">
              <div className="relative flex-shrink-0">
                <img
                  src="/yulia/pagina-principal.jpg"
                  alt="Chef Karolain Rondón"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Chef Karolain Rondón
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Chef Pastelera Profesional
                </p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">+1,000 estudiantes</span>
                </div>
              </div>
            </div>

            {/* Botón WhatsApp principal */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center space-x-4 py-5 px-8 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-xl cursor-pointer mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>Escribir a la Chef ahora</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <p className="text-center text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              📱 Se abrirá WhatsApp con un mensaje listo para enviar
            </p>
          </div>

          {/* ── COLUMNA DERECHA: Información ── */}
          <div className="space-y-6">

            {/* Resumen del curso */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {course.title}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Precio del curso</p>
                    <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ${course.price}{' '}
                      <span className="text-lg text-gray-500 font-normal">USD</span>
                    </p>
                    <p className="text-xs text-gray-400">Pago único · Acceso de por vida</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-green-700 font-semibold">SIN</p>
                    <p className="text-xs text-green-700 font-semibold">COMISIONES</p>
                  </div>
                </div>

                {/* Incluye */}
                <div className="space-y-2">
                  {[
                    '✅ Acceso inmediato tras confirmación',
                    '✅ Videos disponibles de por vida',
                    '✅ Certificado de finalización',
                    '✅ Actualizaciones gratuitas',
                    '✅ Soporte personalizado'
                  ].map((item, i) => (
                    <p key={i} className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Métodos de pago disponibles */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                💳 Métodos de Pago Disponibles
              </h3>
              <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                La Chef te indicará los datos exactos según tu país y preferencia:
              </p>
              <div className="space-y-3">

                {/* Pago Móvil */}
                <div className="flex items-center space-x-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    📱
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Pago Móvil</p>
                    <p className="text-xs text-gray-500">Transferencia en bolívares · Venezuela</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">Bs.</span>
                  </div>
                </div>

                {/* Zelle */}
                <div className="flex items-center space-x-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    🏦
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Zelle</p>
                    <p className="text-xs text-gray-500">Transferencia bancaria · Estados Unidos</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">USD</span>
                  </div>
                </div>

                {/* USDT */}
                <div className="flex items-center space-x-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    💰
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">USDT / Binance</p>
                    <p className="text-xs text-gray-500">Criptomoneda · Internacional</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">Crypto</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Cómo funciona */}
            <div className="bg-gradient-to-br from-[#FF6B6B]/5 to-[#F59E0B]/5 rounded-2xl p-6 border border-[#FF6B6B]/10">
              <h3 className="font-bold text-gray-900 mb-4 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                🚀 ¿Cómo funciona?
              </h3>
              <div className="space-y-4">
                {[
                  {
                    num: '1',
                    title: 'Escríbele a la Chef',
                    desc: 'Haz clic en el botón verde y envía el mensaje por WhatsApp'
                  },
                  {
                    num: '2',
                    title: 'Coordina tu pago',
                    desc: 'La Chef te indica los datos según tu método preferido'
                  },
                  {
                    num: '3',
                    title: 'Realiza la transferencia',
                    desc: 'Paga de forma segura con el método que más te convenga'
                  },
                  {
                    num: '4',
                    title: '¡Accede a tu curso!',
                    desc: 'La Chef activa tu acceso y puedes empezar inmediatamente'
                  }
                ].map((step) => (
                  <div key={step.num} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {step.num}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Franja de confianza */}
        <div className="mt-12 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🔒', title: 'Pago Seguro', desc: 'Coordinado directamente con la Chef' },
              { icon: '⚡', title: 'Acceso Rápido', desc: 'Activación inmediata tras confirmación' },
              { icon: '🌍', title: 'Internacional', desc: 'Disponible para cualquier país' },
              { icon: '💬', title: 'Atención Real', desc: 'Hablas directamente con la Chef' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl mb-2">{item.icon}</span>
                <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}