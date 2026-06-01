import { useState } from 'react';

interface InfoPageProps {
  onNavigate: (page: string) => void;
}

// ═══════════════════════════════════════════════════════════════════
// DATOS DE CONTACTO (un solo lugar para cambiar)
// ═══════════════════════════════════════════════════════════════════
const CONTACT = {
  email: 'informacion.comeback@gmail.com',
  whatsappNumber: '584241055470',
  whatsappDisplay: '+58 424 105 5470',
  instagram: 'https://instagram.com/comeback.pasteleria',
  instagramHandle: '@comeback.pasteleria',
  facebook: 'https://www.facebook.com/comeback.pasteleria',
};

// ═══════════════════════════════════════════════════════════════════
// ESTILOS INLINE PARA BOTONES (Safari iOS fix)
// ═══════════════════════════════════════════════════════════════════

const primaryGradientButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '14px 32px',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
  backgroundColor: '#FF6B6B',
  color: '#ffffff',
  fontWeight: 700,
  borderRadius: '9999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  fontFamily: "'Montserrat', sans-serif",
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s',
  minHeight: '48px',
  WebkitAppearance: 'none',
  appearance: 'none',
  width: '100%',
};

const submitButton: React.CSSProperties = {
  ...primaryGradientButton,
  padding: '14px 24px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '16px', // Evita zoom en iPhone
  fontFamily: "'Montserrat', sans-serif",
  backgroundColor: '#ffffff',
  color: '#111827',
  minHeight: '48px',
  WebkitAppearance: 'none',
  appearance: 'none',
  transition: 'all 0.2s',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '120px',
};

const contactCardStyle: React.CSSProperties = {
  display: 'block',
  textDecoration: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
};

// ═══════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════════════

export function AboutPage({ onNavigate }: InfoPageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div 
        className="text-white py-12 sm:py-16 px-4"
        style={{ 
          background: 'linear-gradient(to right, #FF6B6B, #F59E0B)',
          backgroundColor: '#FF6B6B'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sobre Karolain Rondón
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {!imgError ? (
            <img 
              src="/yulia/foto1.jpg"
              alt="Chef Karolain Rondón"
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div 
              className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center text-8xl"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)', backgroundColor: '#FF6B6B' }}
            >
              👩‍🍳
            </div>
          )}
          <div className="p-6 sm:p-8">
            <h2 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Mi Historia con la Repostería
            </h2>
            <div className="prose prose-base sm:prose-lg max-w-none text-gray-700 space-y-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <p>
                Soy Karolain Rondón y empecé en el mundo de la pastelería desde muy pequeña, haciendo galletas, tortas y golfeados en casa con mi mamá y mi hermana. No era algo profesional aún, pero sí lleno de amor y pasión.
              </p>
              <p>
                A los 18 años realicé mi primer curso de técnicas de horneado. Luego seguí aprendiendo de forma empírica a través de canales como Utilísima y El Gourmet, hasta que, mientras estudiaba Administración, financiaba mis gastos vendiendo mis tortas.
              </p>
              <p>
                En 2018 decidí profesionalizarme y me gradué del Instituto Venezolano Gastronómico. Hice pasantías en el Hotel Pestana Caracas y trabajé en hoteles como Altamira Village y Waldorf, pasando por áreas como pastelería, panadería, pantry y cocina caliente.
              </p>
              <p>
                Durante la pandemia decidí emprender y crear mis propios cursos. Hoy organizo y dicto workshops intensivos donde enseño teoría y práctica de la mano, con paciencia y dedicación. Mi enfoque es dar bases sólidas para que mis alumnos puedan crear y no solo repetir recetas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12">
              <div className="text-center p-5 sm:p-6 bg-gray-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-[#FF6B6B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>15</div>
                <div className="text-gray-600 text-sm sm:text-base">Años de Experiencia</div>
              </div>
              <div className="text-center p-5 sm:p-6 bg-gray-50 rounded-xl">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FF6B6B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>1,000+</div>
                <div className="text-gray-600 text-sm sm:text-base">Estudiantes</div>
              </div>
              <div className="text-center p-5 sm:p-6 bg-gray-50 rounded-xl">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FF6B6B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>🇻🇪</div>
                <div className="text-gray-600 text-sm sm:text-base">Venezuela</div>
              </div>
            </div>

            <div className="mt-10 sm:mt-12 flex justify-center">
              <button 
                onClick={() => onNavigate('courses')}
                style={primaryGradientButton}
              >
                Ver Mis Cursos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FAQ PAGE
// ═══════════════════════════════════════════════════════════════════

export function FAQPage({ onNavigate }: InfoPageProps) {
  const faqs = [
    {
      category: 'Inscripción y Acceso',
      questions: [
        {
          q: '¿Necesito experiencia previa para inscribirme?',
          a: 'No. Mis cursos están diseñados para llevarte de la mano. Seas principiante o tengas algo de conocimiento, aprenderás las técnicas correctas desde cero.'
        },
        {
          q: '¿Cómo accedo al curso después de realizar el pago?',
          a: 'Si es online, ingresas con tu usuario en la web y haces clic en el curso comprado. Si es presencial, al realizar tu abono de $20 por WhatsApp quedas inscrito y te enviamos los detalles para vernos en Torre Europa, El Rosal.'
        },
        {
          q: '¿Cuánto tiempo tendré acceso al contenido?',
          a: 'El acceso es de por vida. El material digital queda disponible para que repases a tu ritmo cuando lo necesites.'
        }
      ]
    },
    {
      category: 'Metodología y Soporte',
      questions: [
        {
          q: '¿Qué pasa si una receta no me funciona al practicar?',
          a: '¡No te desanimes! Escríbeme por WhatsApp y revisamos juntos el paso a paso para encontrar el error y solucionarlo.'
        },
        {
          q: '¿Puedo hacer preguntas durante mi aprendizaje?',
          a: 'Sí, puedes escribirme por WhatsApp. Te pido un poco de paciencia con el tiempo de respuesta debido al volumen de alumnos.'
        },
        {
          q: '¿Necesito herramientas profesionales o especiales?',
          a: 'No son obligatorias. Todo está pensado para que puedas practicar desde casa con utensilios básicos. En clase te indico cuáles herramientas profesionales pueden ayudarte más.'
        },
        {
          q: '¿Entregan certificado?',
          a: 'Sí. Al finalizar recibirás un certificado digital de participación.'
        }
      ]
    },
    {
      category: 'Cursos Presenciales',
      questions: [
        {
          q: '¿Qué incluye la modalidad presencial en la Torre Europa?',
          a: 'Incluye todos los insumos, guía, certificado digital, gorro y delantal para uso en clase. Además, te llevas todo lo que prepares.'
        },
        {
          q: '¿Cómo puedo reservar y pagar un curso presencial?',
          a: 'Puedes reservar tu cupo con $20 vía WhatsApp. El resto se paga el día del curso. Aceptamos efectivo, pago móvil, Zelle o Binance.'
        },
        {
          q: '¿Qué debo llevar el día del curso?',
          a: 'Libreta o cuaderno para anotar tips y tu almuerzo (tenemos 30 minutos para comer). El lugar está acondicionado para estar cómodos.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div 
        className="text-white py-12 sm:py-16 px-4"
        style={{ 
          background: 'linear-gradient(to right, #FF6B6B, #F59E0B)',
          backgroundColor: '#FF6B6B'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Preguntas Frecuentes
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Todo lo que necesitas saber sobre nuestros cursos
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {faqs.map((section, idx) => (
          <div key={idx} className="mb-10 sm:mb-12">
            <h2 
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {section.category}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {section.questions.map((faq, qIdx) => (
                <details key={qIdx} className="group bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                  <summary className="font-semibold text-base sm:text-lg text-gray-900 cursor-pointer flex justify-between items-start gap-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <span className="flex-1">{faq.q}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-[#FEF3C7] rounded-2xl p-6 sm:p-8 text-center">
          <h3 
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-gray-700 mb-5 sm:mb-6 text-sm sm:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Contáctanos y te responderemos en menos de 24 horas
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => onNavigate('contact')}
              style={{ ...primaryGradientButton, width: 'auto' }}
            >
              Ir a Contacto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONTACT PAGE (Formulario que SÍ envía por WhatsApp)
// ═══════════════════════════════════════════════════════════════════

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Construir mensaje para WhatsApp
    const whatsappMessage = encodeURIComponent(
      `¡Hola Chef Karolain! 👋\n\n` +
      `📩 *Nuevo mensaje desde la web*\n\n` +
      `*Nombre:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n\n` +
      `*Mensaje:*\n${formData.message}`
    );

    const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${whatsappMessage}`;

    // Pequeño delay para feedback visual
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setSending(false);
      setFormData({ name: '', email: '', message: '' });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div 
        className="text-white py-12 sm:py-16 px-4"
        style={{ 
          background: 'linear-gradient(to right, #FF6B6B, #F59E0B)',
          backgroundColor: '#FF6B6B'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contacto
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">

          {/* ═══════════════════════════════════════════════════════════════
              FORMULARIO
          ═══════════════════════════════════════════════════════════════ */}
          <div>
            <h2 
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Envíanos un mensaje
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs sm:text-sm text-blue-700">
              💡 Al enviar el mensaje, se abrirá WhatsApp con tu mensaje listo para enviar a la Chef.
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nombre <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Tu nombre completo"
                  style={inputStyle}
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Email <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="tu@email.com"
                  style={inputStyle}
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Mensaje <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="¿Cómo podemos ayudarte?"
                  style={textareaStyle}
                  disabled={sending}
                />
              </div>
              <button 
                type="submit"
                disabled={sending}
                style={{
                  ...submitButton,
                  opacity: sending ? 0.7 : 1,
                  cursor: sending ? 'not-allowed' : 'pointer',
                }}
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Abriendo WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Enviar por WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              OTRAS FORMAS DE CONTACTO (TODAS CLICKEABLES)
          ═══════════════════════════════════════════════════════════════ */}
          <div>
            <h2 
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Otras formas de contacto
            </h2>
            <div className="space-y-4">

              {/* Email */}
              <a 
                href={`mailto:${CONTACT.email}`}
                style={contactCardStyle}
                className="bg-white rounded-xl shadow-md p-5 sm:p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>Email</h3>
                    <p className="text-gray-600 text-xs sm:text-sm break-all">{CONTACT.email}</p>
                    <p className="text-xs text-gray-500 mt-1">📨 Respuesta en 24h</p>
                  </div>
                </div>
              </a>

              {/* Instagram */}
              <a 
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={contactCardStyle}
                className="bg-white rounded-xl shadow-md p-5 sm:p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>Instagram</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{CONTACT.instagramHandle}</p>
                    <p className="text-xs text-gray-500 mt-1">📸 Síguenos para tips diarios</p>
                  </div>
                </div>
              </a>

              {/* WhatsApp */}
              <a 
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={contactCardStyle}
                className="bg-white rounded-xl shadow-md p-5 sm:p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>WhatsApp</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{CONTACT.whatsappDisplay}</p>
                    <p className="text-xs text-gray-500 mt-1">💬 Lun-Vie 9am-6pm</p>
                  </div>
                </div>
              </a>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}