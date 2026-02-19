interface InfoPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Karolain Rondon</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <img 
            src="/yulia/foto1.jpg"
            alt="Chef Karolain Rondon"
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Mi Historia con la Repostería
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Soy Karolain Rondon y empecé en el mundo de la pastelería desde muy pequeña, haciendo galletas, tortas y golfeados en casa con mi mamá y mi hermana. No era algo profesional aún, pero sí lleno de amor y pasión.
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

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-[#FF6B6B] mb-2">15</div>
                <div className="text-gray-600">Años de Experiencia</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-[#FF6B6B] mb-2">1,000–2,000</div>
                <div className="text-gray-600">Estudiantes</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-[#FF6B6B] mb-2">Venezuela</div>
                <div className="text-gray-600">País principal</div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => onNavigate('courses')}
                className="px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl opacity-90">Todo lo que necesitas saber sobre nuestros cursos</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {faqs.map((section, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.category}</h2>
            <div className="space-y-4">
              {section.questions.map((faq, qIdx) => (
                <details key={qIdx} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer flex justify-between items-center">
                    {faq.q}
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-[#FEF3C7] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿No encuentras lo que buscas?</h3>
          <p className="text-gray-700 mb-6">Contáctanos y te responderemos en menos de 24 horas</p>
          <button 
            onClick={() => onNavigate('contact')}
            className="px-8 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-bold rounded-full hover:shadow-lg transition-all"
          >
            Ir a Contacto
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h2>
          <p className="text-gray-600">Te responderemos en menos de 24 horas a {formData.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl opacity-90">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Otras formas de contacto</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">informacion.comeback@gmail.com</p>
                    <p className="text-sm text-gray-500 mt-1">Respuesta en 24h</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Instagram</h3>
                    <p className="text-gray-600">@comeback.pasteleria</p>
                    <p className="text-sm text-gray-500 mt-1">Síguenos para tips diarios</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">+58 4241055470</p>
                    <p className="text-sm text-gray-500 mt-1">Lun-Vie 9am-6pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
