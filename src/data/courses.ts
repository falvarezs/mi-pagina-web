export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  resources?: string[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;  // ← CAMBIADO de string a number
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: string;
  category: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos';
  duration: string;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  trailerUrl: string;
  featured: boolean;
  whatYouLearn: string[];
  includes: string[];
  modules: Module[];
}

export const courses: Course[] = [
  {
    id: 1,  // ← CAMBIADO de '1' a 1
    title: 'Pastelería Saludable',
    slug: 'pasteleria-saludable',
    shortDescription: 'Aprende a realizar postres sin gluten, sin azúcar y sin lactosa con mucho sabor',
    fullDescription: 'En este curso aprenderás todas las bases de la pastelería saludable, como la elección adecuada de los ingredientes, los diferentes tipos de endulzantes que existen hoy en el mercado, sus beneficios en la salud y manera de utilizar, así como también la formulación del harina todo uso sin gluten. Realizaremos de igual manera harina de almendras de manera artesanal y conoceremos los beneficios del ghee. Con toda esta teoría aprenderás a aplicarla a nuestras recetas: brownie húmedo de chocolate, coffee cake de arándanos y almendras, panqué de vainilla y chocolate, cookies de chips de chocolate y torta de zanahoria glaseada. Este curso es perfecto para personas que quieren comer rico pero cuidar su salud, emprendedores que quieren ofrecer opciones saludables, o simplemente amantes de la repostería que buscan alternativas más sanas.',
    price: 40,
    currency: 'USD',
    category: 'Pastelería Saludable',
    level: 'Todos',
    duration: '8 horas',
    studentsCount: 234,
    rating: 4.9,
    reviewsCount: 47,
    thumbnail: '/yulia/brownies-saludables.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: true,
    whatYouLearn: [
      'Sustitutos saludables para azúcar refinada (stevia, eritritol, dátiles)',
      'Técnicas de horneado para harinas alternativas (almendra, coco, avena)',
      'Balance perfecto de humedad sin lácteos ni huevos',
      'Decoración profesional con ingredientes naturales',
      'Cálculo nutricional básico para tus creaciones',
      'Conservación y almacenamiento adecuado'
    ],
    includes: [
      '8 horas de video HD bajo demanda',
      'Recetario descargable con recetas exclusivas',
      'Guía de sustituciones imprimible',
      'Plantillas de costeo para vender tus postres',
      'Acceso de por vida al contenido',
      'Actualizaciones gratuitas',
      'Certificado de finalización'
    ],
    modules: [
      {
        id: 'm1',
        title: 'Fundamentos de la Pastelería Saludable',
        lessons: [
          { id: 'l1', title: 'Bienvenida y filosofía del curso', duration: '8:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', resources: ['/resources/recetario-pasteleria.txt'] },
          { id: 'l2', title: 'Ingredientes esenciales y dónde conseguirlos', duration: '15:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l3', title: 'Equipamiento necesario', duration: '10:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      },
      {
        id: 'm2',
        title: 'Bases y Masas Saludables',
        lessons: [
          { id: 'l4', title: 'Masa quebrada sin mantequilla', duration: '22:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', resources: ['/resources/guia-sustituciones.txt'] },
          { id: 'l5', title: 'Bizcocho esponjoso sin huevo', duration: '25:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l6', title: 'Cremas y rellenos naturales', duration: '18:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      },
      {
        id: 'm3',
        title: 'Postres Completos',
        lessons: [
          { id: 'l7', title: 'Cheesecake de frutos rojos sin azúcar', duration: '30:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l8', title: 'Brownies de chocolate intenso y aguacate', duration: '20:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', resources: ['/resources/recetario-pasteleria.txt'] },
          { id: 'l9', title: 'Tarta de zanahoria con frosting de anacardos', duration: '28:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      }
    ]
  },
  {
    id: 2,  // ← CAMBIADO de '2' a 2
    title: 'Cookies Estilo New York: Técnica y Perfección',
    slug: 'cookies-new-york',
    shortDescription: 'Crea las cookies más famosas del mundo: crujientes por fuera, suaves por dentro',
    fullDescription: 'Aprende los secretos de las icónicas cookies de Nueva York. Desde la selección perfecta de chocolates hasta el tiempo exacto de horneado, dominarás cada detalle para lograr esa textura única que las hace irresistibles. Incluye variaciones gourmet y técnicas de conservación.',
    price: 40,
    currency: 'USD',
    category: 'Galletas',
    level: 'Principiante',
    duration: '5 horas',
    studentsCount: 189,
    rating: 5.0,
    reviewsCount: 32,
    thumbnail: '/yulia/cookies-newyork.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: true,
    whatYouLearn: [
      'La fórmula exacta de la masa perfecta',
      'Tipos de chocolate y cómo combinarlos',
      'Control de temperatura para textura ideal',
      'Secretos del reposo en frío',
      'Horneado perfecto: tiempos y señales',
      'Variaciones: triple chocolate, nuez pecana, M&Ms'
    ],
    includes: [
      '6-8 horas de video paso a paso',
      'Recetario descargable con 6 sabores completos',
      'Guía de congelación y horneado profesional',
      'Tabla de conversión de medidas',
      'Acceso de por vida',
      'Grupo de estudiantes para compartir resultados'
    ],
    modules: [
      {
        id: 'm1',
        title: 'La Cookie Clásica',
        lessons: [
          { id: 'l1', title: 'Ingredientes premium: qué usar y por qué', duration: '12:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', resources: ['/resources/recetario-cookies.txt'] },
          { id: 'l2', title: 'Técnica de mezclado: orden y textura', duration: '15:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l3', title: 'El poder del reposo: 24-72 horas', duration: '8:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      },
      {
        id: 'm2',
        title: 'Horneado y Terminado',
        lessons: [
          { id: 'l4', title: 'Preparación de bandejas y espaciado', duration: '10:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', resources: ['/resources/guia-horneado.txt'] },
          { id: 'l5', title: 'Tiempos según tu horno', duration: '18:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l6', title: 'Enfriamiento y almacenamiento', duration: '9:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      }
    ]
  },
  {
    id: 3,  // ← CAMBIADO de '3' a 3
    title: 'Arte en Bombones y Tabletas de Chocolate',
    slug: 'arte-chocolate',
    shortDescription: 'Domina el temperado del chocolate y crea piezas dignas de chocolatería profesional',
    fullDescription: 'Sumérgete en el fascinante mundo del chocolate artesanal. Aprenderás el temperado perfecto, moldeado profesional, rellenos creativos y decoración de alta gama. Ideal para quienes quieren emprender en chocolatería o elevar sus habilidades a nivel experto.',
    price: 40,
    currency: 'USD',
    category: 'Chocolate',
    level: 'Avanzado',
    duration: '10 horas',
    studentsCount: 156,
    rating: 4.8,
    reviewsCount: 28,
    thumbnail: '/yulia/bombones.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured: true,
    whatYouLearn: [
      'Temperado perfecto: método tradicional y con microondas',
      'Trabajo con moldes policarbonatos',
      'Ganaches cremosos y estables',
      'Decoración con manteca de cacao coloreada',
      'Transfer sheets y técnicas de acabado',
      'Empaque profesional para venta'
    ],
    includes: [
      '6-9 horas de contenido exclusivo',
      'Recetario descargable de rellenos gourmet',
      'Guía de proveedores y materiales recomendados',
      'Plantillas de diseño imprimibles',
      'Calculadora de costos y precios',
      'Certificado profesional'
    ],
    modules: [
      {
        id: 'm1',
        title: 'Ciencia del Chocolate',
        lessons: [
          { id: 'l1', title: 'Tipos de chocolate: cobertura vs regular', duration: '14:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', resources: ['/resources/guia-chocolate.txt'] },
          { id: 'l2', title: 'El temperado: teoría y cristalización', duration: '22:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l3', title: 'Práctica de temperado paso a paso', duration: '28:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      },
      {
        id: 'm2',
        title: 'Bombones Profesionales',
        lessons: [
          { id: 'l4', title: 'Trabajo con moldes: pintura y llenado', duration: '25:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', resources: ['/resources/recetario-bombones.txt'] },
          { id: 'l5', title: 'Ganaches: proporciones y sabores', duration: '30:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l6', title: 'Sellado perfecto y desmolde', duration: '18:35', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      },
      {
        id: 'm3',
        title: 'Tabletas de Autor',
        lessons: [
          { id: 'l7', title: 'Diseño y composición de sabores', duration: '20:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l8', title: 'Inclusiones: frutas, frutos secos, especias', duration: '22:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l9', title: 'Acabado profesional y empaque', duration: '17:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      }
    ]
  }
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find(course => course.slug === slug);
};

export const getCourseById = (id: number): Course | undefined => {  // ← NUEVA FUNCIÓN
  return courses.find(course => course.id === id);
};

export const getFeaturedCourses = (): Course[] => {
  return courses.filter(course => course.featured);
};

export const getCoursesByCategory = (category: string): Course[] => {
  if (category === 'Todos') return courses;
  return courses.filter(course => course.category === category);
};

export const categories = ['Todos', 'Pastelería', 'Galletas', 'Chocolate'];
export const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];