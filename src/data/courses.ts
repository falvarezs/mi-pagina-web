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
  id: number;
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
    id: 1,
    title: 'Pastelería Saludable',
    slug: 'pasteleria-saludable',
    shortDescription: 'Aprende a realizar postres sin gluten, sin azúcar y sin lactosa con mucho sabor',
    fullDescription: 'En este curso aprenderás todas las bases de la pastelería saludable, como la elección adecuada de los ingredientes, los diferentes tipos de endulzantes que existen hoy en el mercado, sus beneficios en la salud y manera de utilizar, así como también la formulación del harina todo uso sin gluten. Realizaremos de igual manera harina de almendras de manera artesanal y conoceremos los beneficios del ghee. Con toda esta teoría aprenderás a aplicarla a nuestras recetas: brownie húmedo de chocolate, coffee cake de arándanos y almendras, panqué de vainilla y chocolate, cookies de chips de chocolate y torta de zanahoria glaseada. Este curso es perfecto para personas que quieren comer rico pero cuidar su salud, emprendedores que quieren ofrecer opciones saludables, o simplemente amantes de la repostería que buscan alternativas más sanas.',
    price: 40,
    currency: 'USD',
    category: 'Pastelería Saludable',
    level: 'Todos',
    duration: '3 horas',
    studentsCount: 234,
    rating: 4.9,
    reviewsCount: 47,
    thumbnail: '/yulia/brownies-saludables.jpg',
    trailerUrl: 'PENDIENTE_TRAILER',
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
      '39 videos con contenido exclusivo',
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
        title: 'Módulo 1: Introducción e Ingredientes',
        lessons: [
          { id: 'l1', title: 'Video 1 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_1' },
          { id: 'l2', title: 'Video 2 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_2' },
          { id: 'l3', title: 'Video 3 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_3' },
          { id: 'l4', title: 'Video 4 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_4' },
          { id: 'l5', title: 'Video 5 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_5' },
          { id: 'l6', title: 'Video 6 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_6' },
          { id: 'l7', title: 'Video 7 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_7' },
          { id: 'l8', title: 'Video 8 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_8' },
          { id: 'l9', title: 'Video 9 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_9' },
          { id: 'l10', title: 'Video 10 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_10' },
          { id: 'l11', title: 'Video 11 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_11' },
          { id: 'l12', title: 'Video 12 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_12' },
          { id: 'l13', title: 'Video 13 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_13' }
        ]
      },
      {
        id: 'm2',
        title: 'Módulo 2: Técnicas y Masas',
        lessons: [
          { id: 'l14', title: 'Video 14 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_14' },
          { id: 'l15', title: 'Video 15 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_15' },
          { id: 'l16', title: 'Video 16 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_16' },
          { id: 'l17', title: 'Video 17 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_17' },
          { id: 'l18', title: 'Video 18 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_18' },
          { id: 'l19', title: 'Video 19 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_19' },
          { id: 'l20', title: 'Video 20 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_20' },
          { id: 'l21', title: 'Video 21 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_21' },
          { id: 'l22', title: 'Video 22 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_22' },
          { id: 'l23', title: 'Video 23 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_23' },
          { id: 'l24', title: 'Video 24 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_24' },
          { id: 'l25', title: 'Video 25 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_25' },
          { id: 'l26', title: 'Video 26 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_26' }
        ]
      },
      {
        id: 'm3',
        title: 'Módulo 3: Recetas Finales y Decoración',
        lessons: [
          { id: 'l27', title: 'Video 27 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_27' },
          { id: 'l28', title: 'Video 28 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_28' },
          { id: 'l29', title: 'Video 29 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_29' },
          { id: 'l30', title: 'Video 30 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_30' },
          { id: 'l31', title: 'Video 31 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_31' },
          { id: 'l32', title: 'Video 32 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_32' },
          { id: 'l33', title: 'Video 33 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_33' },
          { id: 'l34', title: 'Video 34 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_34' },
          { id: 'l35', title: 'Video 35 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_35' },
          { id: 'l36', title: 'Video 36 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_36' },
          { id: 'l37', title: 'Video 37 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_37' },
          { id: 'l38', title: 'Video 38 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_38' },
          { id: 'l39', title: 'Video 39 - Nombre pendiente', duration: '0:00', videoUrl: 'PENDIENTE_VIDEO_39' }
        ]
      }
    ]
  },
  {
    id: 2,
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
    trailerUrl: 'PENDIENTE_TRAILER_COOKIES',
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
          { id: 'l1', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l2', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l3', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' }
        ]
      },
      {
        id: 'm2',
        title: 'Horneado y Terminado',
        lessons: [
          { id: 'l4', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l5', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l6', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' }
        ]
      }
    ]
  },
  {
    id: 3,
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
    trailerUrl: 'PENDIENTE_TRAILER_CHOCOLATE',
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
          { id: 'l1', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l2', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l3', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' }
        ]
      },
      {
        id: 'm2',
        title: 'Bombones Profesionales',
        lessons: [
          { id: 'l4', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l5', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l6', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' }
        ]
      },
      {
        id: 'm3',
        title: 'Tabletas de Autor',
        lessons: [
          { id: 'l7', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l8', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' },
          { id: 'l9', title: 'Próximamente', duration: '0:00', videoUrl: 'PENDIENTE' }
        ]
      }
    ]
  }
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find(course => course.slug === slug);
};

export const getCourseById = (id: number): Course | undefined => {
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