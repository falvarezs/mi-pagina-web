import { Testimonials } from '../components/Testimonials';
import { AwardIcon, CheckCircleIcon } from '../components/Icons';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-[#FEF3C7]/30 to-white py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Column - Texto */}
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-[#FF6B6B]/10 to-[#F59E0B]/10 border border-[#FF6B6B]/20 rounded-full text-sm font-semibold text-[#FF6B6B] uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Chef Profesional • Educadora
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Karolain Rondón
              </h1>
              <p className="text-base sm:text-lg text-gray-500 uppercase tracking-[0.25em] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Chef Pastelera
              </p>

              <div className="mb-8">
                <p className="text-2xl sm:text-3xl text-gray-700 font-light leading-relaxed mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Convierto tu pasión por la repostería en técnica, confianza y resultados reales
                </p>
                <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Empecé horneando en casa con mi mamá y mi hermana, y hoy soy graduada del Instituto Venezolano Gastronómico (2018), con experiencia en hoteles como Pestana Caracas, Altamira Village y Waldorf. He formado a más de 1,000 estudiantes con paciencia, bases sólidas y práctica guiada.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircleIcon className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <p className="text-gray-700 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <span className="font-semibold">15 años</span> de experiencia (8 profesional)
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircleIcon className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <p className="text-gray-700 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <span className="font-semibold">1,000–2,000 estudiantes</span> formados
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircleIcon className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <p className="text-gray-700 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Especialista en <span className="font-semibold">repostería saludable</span> y <span className="font-semibold">chocolatería artesanal</span>
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('courses')}
                  className="cursor-pointer group px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-bold rounded-full hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center space-x-2 transform hover:scale-105"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <span>Ver Mis Cursos</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="cursor-pointer px-8 py-4 bg-white text-gray-800 font-semibold rounded-full hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Conoce Mi Historia
                </button>
              </div>
            </div>

            {/* Right Column - Imagen */}
            <div className="order-1 lg:order-2">
              <div className="relative">

                {/* Imagen Principal */}
                <div className="relative z-10">
                  <div className="aspect-square max-w-xs sm:max-w-sm lg:max-w-lg mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl ring-8 ring-white/50 ring-offset-8 ring-offset-[#FEF3C7]/20">
                      <img
                        src="/yulia/pagina-principal.jpg"
                        alt="Chef Karolain Rondón"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Decoración de fondo */}
                <div className="absolute -top-8 -right-8 w-72 h-72 bg-gradient-to-br from-[#FF6B6B]/20 to-[#F59E0B]/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-gradient-to-br from-[#14B8A6]/20 to-[#0D9488]/20 rounded-full blur-3xl -z-10"></div>

                {/* ── BADGES: Solo visibles en pantallas grandes (lg) ── */}

                {/* Badge 1: Chef Certificada - Top Right */}
                <div className="hidden lg:block absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform animate-float z-20">
                  <div className="flex items-center space-x-2">
                    <AwardIcon className="w-6 h-6 text-[#F59E0B]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Chef Certificada</p>
                      <p className="text-xs text-gray-500 uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>IVG 2018</p>
                    </div>
                  </div>
                </div>

                {/* Badge 2: Estudiantes - Bottom Left */}
                <div className="hidden lg:block absolute bottom-8 left-8 bg-white rounded-2xl shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-transform animate-float-delayed z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>1,000+</p>
                      <p className="text-sm text-gray-500 uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.7rem' }}>Estudiantes</p>
                    </div>
                  </div>
                </div>

                {/* Badge 3: 15 Años - Top Left */}
                <div className="hidden lg:block absolute top-4 left-4 bg-gradient-to-br from-[#FF6B6B] to-[#F59E0B] rounded-2xl shadow-xl px-5 py-3 transform -rotate-6 hover:rotate-0 transition-transform animate-float-slow z-20">
                  <div className="text-center text-white">
                    <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>15</p>
                    <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>Años</p>
                  </div>
                </div>

                {/* Badge 4: Award - Top Center */}
                <div className="hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl p-4 hover:scale-110 transition-transform animate-float z-20">
                  <AwardIcon className="w-8 h-8 text-[#F59E0B]" />
                </div>

                {/* Badge 5: 100% Online - Right Center */}
                <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/4 -translate-y-1/2 bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-xl shadow-xl px-4 py-3 transform rotate-90 hover:rotate-0 transition-transform animate-float-delayed z-20">
                  <div className="text-white text-center">
                    <p className="text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>100% Online</p>
                  </div>
                </div>

                {/* Badge 6: 8 Años Pro - Left Center */}
                <div className="hidden lg:block absolute left-0 top-1/3 -translate-x-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 transform -rotate-12 hover:rotate-0 transition-transform animate-float-slow z-20">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>8</p>
                    <p className="text-xs text-gray-600 uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Años Pro</p>
                  </div>
                </div>

                {/* Badge 7: 3 Cursos - Bottom Right */}
                <div className="hidden lg:block absolute bottom-4 right-4 bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-2xl shadow-xl px-5 py-3 transform rotate-6 hover:rotate-0 transition-transform animate-float-delayed-2 z-20">
                  <div className="text-white text-center">
                    <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>3</p>
                    <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>Cursos</p>
                  </div>
                </div>

                {/* Badge 8: 98% - Bottom Center */}
                <div className="hidden lg:block absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl px-5 py-3 hover:scale-110 transition-transform animate-float-slow z-20">
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>98%</p>
                    <p className="text-xs text-gray-600 uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Satisfacción</p>
                  </div>
                </div>

                {/* ── BADGES MÓVIL: Solo en pantallas pequeñas ── */}
                {/* Versión simplificada: solo 2 badges que no tapan la cara */}
                <div className="flex lg:hidden justify-center gap-4 mt-6">
                  <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center space-x-2 border border-gray-100">
                    <AwardIcon className="w-5 h-5 text-[#F59E0B]" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Chef Certificada</p>
                      <p className="text-xs text-gray-500">IVG 2018</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center space-x-2 border border-gray-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">1,000+</p>
                      <p className="text-xs text-gray-500">Estudiantes</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mis Especialidades */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mis Especialidades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Cursos diseñados para llevarte de principiante a profesional
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-white to-[#FEF3C7]/30 p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                 onClick={() => onNavigate('courses')}>
              <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6">
                <img src="/yulia/brownies-saludables.jpg" alt="Pastelería saludable" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Pastelería Saludable</h3>
              <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Descubre cómo crear postres irresistibles sin azúcar refinada. Aprende técnicas para hornear con ingredientes naturales y nutritivos.
              </p>
              <div className="flex items-center text-[#FF6B6B] font-semibold group-hover:gap-2 transition-all" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span>Ver curso</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white to-[#FEF3C7]/30 p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                 onClick={() => onNavigate('courses')}>
              <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6">
                <img src="/yulia/cookies-newyork.jpg" alt="Cookies estilo New York" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Cookies Estilo New York</h3>
              <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Domina el arte de las cookies perfectas: crocantes por fuera, suaves por dentro. Técnicas profesionales de las mejores pastelerías.
              </p>
              <div className="flex items-center text-[#F59E0B] font-semibold group-hover:gap-2 transition-all" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span>Ver curso</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white to-[#FEF3C7]/30 p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                 onClick={() => onNavigate('courses')}>
              <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6">
                <img src="/yulia/bombones.jpg" alt="Arte en bombones" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Arte en Bombones</h3>
              <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Conviértete en maestro chocolatero. Aprende temperado perfecto, rellenos premium y presentaciones dignas de chocolatería de lujo.
              </p>
              <div className="flex items-center text-[#14B8A6] font-semibold group-hover:gap-2 transition-all" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span>Ver curso</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redes Sociales */}
      <section className="py-16 px-4 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Sígueme en Redes</h2>
            <p className="text-gray-600 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>Conecta conmigo y mira resultados reales de mis estudiantes</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="https://instagram.com/comeback.pasteleria" target="_blank" rel="noopener noreferrer" className="cursor-pointer bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Instagram</h3>
              <p className="text-sm text-gray-600">@comeback.pasteleria</p>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Facebook</h3>
              <p className="text-sm text-gray-600">comeback pasteleria</p>
            </a>
            <a href="https://wa.me/584241055470" target="_blank" rel="noopener noreferrer" className="cursor-pointer bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>WhatsApp</h3>
              <p className="text-sm text-gray-600">+58 424 105 5470</p>
            </a>
            <a href="mailto:informacion.comeback@gmail.com" className="cursor-pointer bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Email</h3>
              <p className="text-sm text-gray-600">informacion.comeback@gmail.com</p>
            </a>
          </div>
        </div>
      </section>

      {/* Momentos reales */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Experiencias Reales en Clase</h2>
              <p className="text-lg text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>Fotos auténticas de talleres, alumnos y resultados</p>
            </div>
            <button onClick={() => onNavigate('courses')} className="cursor-pointer text-[#FF6B6B] font-semibold hover:underline" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Ver cursos →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['foto1.jpg', 'foto2.jpg', 'foto3.jpg'].map((photo) => (
              <div key={photo} className="group overflow-hidden rounded-2xl shadow-md bg-gray-50">
                <img src={`/yulia/${photo}`} alt="Taller de repostería con Karolain Rondón" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['foto4.jpg', 'foto5.jpg', 'foto6.jpg'].map((photo) => (
              <div key={photo} className="group overflow-hidden rounded-2xl shadow-md bg-white">
                <img src={`/yulia/${photo}`} alt="Momentos reales de los cursos de Karolain Rondón" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <Testimonials />

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#FF6B6B] via-[#F59E0B] to-[#FF6B6B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Lista para Empezar?
          </h2>
          <p className="text-xl sm:text-2xl mb-10 opacity-95 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Únete a más de 1,200 estudiantes que ya están creando postres increíbles.<br />
            Acceso de por vida • Sin horarios • A tu ritmo
          </p>
          <button
            onClick={() => onNavigate('courses')}
            className="cursor-pointer group px-10 py-5 bg-white text-[#FF6B6B] font-bold rounded-full hover:shadow-2xl transition-all duration-300 text-lg inline-flex items-center space-x-3 transform hover:scale-105"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span>Explorar Todos los Cursos</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm opacity-90">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Acceso inmediato</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Videos HD</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Certificado incluido</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Recetarios PDF</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}