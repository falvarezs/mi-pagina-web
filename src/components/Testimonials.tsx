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
    <section className="py-20 bg-gradient-to-br from-[#FEF3C7] via-white to-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Lo que Dicen Nuestros Estudiantes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Más de 1,200 estudiantes han transformado su pasión por la repostería en habilidades profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-[#F59E0B] fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#F59E0B] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {testimonial.country ? `${testimonial.country} • ` : ''}{testimonial.course}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-[#FF6B6B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              1,200+
            </div>
            <p className="text-gray-600 text-sm uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Estudiantes
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-[#F59E0B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              98%
            </div>
            <p className="text-gray-600 text-sm uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Satisfacción
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-[#14B8A6] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              15+
            </div>
            <p className="text-gray-600 text-sm uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Países
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-[#FF6B6B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              4.9
            </div>
            <p className="text-gray-600 text-sm uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Calificación
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
