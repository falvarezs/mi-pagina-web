import { StarIcon } from './Icons';

interface Testimonial {
  name: string;
  country: string;
  text: string;
  rating: number;
  course: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Valentina Herrera",
    country: "",
    text: "Fue una experiencia muy enriquecedora. La calidad de la enseñanza y el apoyo de la Chef Karolain hicieron de este curso un día espectacular y lleno de aprendizaje.",
    rating: 5,
    course: "Pastelería Saludable",
  },
  {
    name: "Gabriela Méndez",
    country: "",
    text: "Aprendizaje claro y único. Gracias por la paciencia y dedicación en cada workshop. Todo quedó delicioso y el contenido es impecable.",
    rating: 5,
    course: "Cookies Estilo New York",
  },
  {
    name: "Daniela Rivas",
    country: "",
    text: "Sigo aprendiendo muchísimo con mi chef preferida. Gracias por compartir tus conocimientos con tanta dedicación.",
    rating: 5,
    course: "Pastelería Saludable",
  },
  {
    name: "Mariana Pérez",
    country: "",
    text: "La torta de zanahoria quedó a un nivel brutal. En casa estaban escépticos y quedaron encantados con el sabor y la textura.",
    rating: 5,
    course: "Pastelería Saludable",
  },
  {
    name: "Isabella Suárez",
    country: "",
    text: "Todo resultó maravilloso: masa excelente y horneado perfecto. Aprendí con una gran maestra y ahora a practicar para perfeccionar.",
    rating: 5,
    course: "Arte en Bombones y Tabletas",
  },
  {
    name: "Camila Duarte",
    country: "",
    text: "No hay nada más lindo que ver un resultado final satisfactorio hecho con nuestras propias manos. Fue una jornada increíble.",
    rating: 5,
    course: "Arte en Bombones y Tabletas",
  },
  {
    name: "Paola Salazar",
    country: "",
    text: "Me encantó el grupo y el ambiente. Cada quien aportó y superó todas mis expectativas. Repetiría sin duda.",
    rating: 5,
    course: "Cookies Estilo New York",
  },
  {
    name: "Andrea Morales",
    country: "",
    text: "Un día mágico. Los resultados del curso fueron lo mejor y se notó todo el empeño en que aprendiéramos bien.",
    rating: 5,
    course: "Pastelería Saludable",
  },
  {
    name: "Sofía Camacho",
    country: "",
    text: "Excelente profesional y ser humano. Gracias por transmitir tus conocimientos de forma clara y cercana.",
    rating: 5,
    course: "Cookies Estilo New York",
  },
  {
    name: "Carolina Urbina",
    country: "",
    text: "Resultados excelentes y un grupo de gran calidad humana. Me llevo conocimientos valiosos para mis emprendimientos.",
    rating: 5,
    course: "Arte en Bombones y Tabletas",
  }
];

export function Testimonials() {
  return (
    <section 
      className="py-12 sm:py-16 lg:py-20 w-full overflow-x-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #FEF3C7 0%, #ffffff 50%, #F9FAFB 100%)',
        backgroundColor: '#FEF3C7',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ HEADER ══ */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lo que Dicen Nuestros Estudiantes
          </h2>
          <p 
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Más de 1,200 estudiantes han transformado su pasión por la repostería en habilidades profesionales
          </p>
        </div>

        {/* ══ GRID DE TESTIMONIOS ══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p 
                className="text-gray-700 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base" 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
                      backgroundColor: '#FF6B6B',
                    }}
                  >
                    <span 
                      className="text-white font-bold text-base sm:text-lg" 
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p 
                      className="font-semibold text-gray-900 text-sm sm:text-base truncate" 
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {testimonial.name}
                    </p>
                    <p 
                      className="text-xs sm:text-sm text-gray-500 truncate" 
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {testimonial.country ? `${testimonial.country} • ` : ''}{testimonial.course}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ══ STATS ══ */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="text-center">
            <div 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#FF6B6B',
              }}
            >
              1,200+
            </div>
            <p 
              className="text-gray-600 text-xs sm:text-sm uppercase tracking-wide" 
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Estudiantes
            </p>
          </div>
          <div className="text-center">
            <div 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#F59E0B',
              }}
            >
              98%
            </div>
            <p 
              className="text-gray-600 text-xs sm:text-sm uppercase tracking-wide" 
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Satisfacción
            </p>
          </div>
          <div className="text-center">
            <div 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#14B8A6',
              }}
            >
              15+
            </div>
            <p 
              className="text-gray-600 text-xs sm:text-sm uppercase tracking-wide" 
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Países
            </p>
          </div>
          <div className="text-center">
            <div 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#FF6B6B',
              }}
            >
              4.9
            </div>
            <p 
              className="text-gray-600 text-xs sm:text-sm uppercase tracking-wide" 
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Calificación
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}