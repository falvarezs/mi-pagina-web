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
    trailerUrl: 'https://www.youtube.com/embed/KFW34CW3f5k',
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
      '41 videos con contenido exclusivo',
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
        title: 'Módulo 1: Ingredientes y Endulzantes',
        lessons: [
          { id: 'l1', title: 'Bienvenida al curso de pastelería saludable', duration: '0:37', videoUrl: 'https://www.youtube.com/embed/KFW34CW3f5k' },
          { id: 'l2', title: 'Conoce a tu profesora', duration: '0:45', videoUrl: 'https://www.youtube.com/embed/n-0eAyLd7X8' },
          { id: 'l3', title: 'Introducción y descripción de ingredientes', duration: '8:26', videoUrl: 'https://www.youtube.com/embed/2odwG_7YuyY' },
          { id: 'l4', title: 'Tipos de endulzantes. Endulzantes naturales calóricos', duration: '1:39', videoUrl: 'https://www.youtube.com/embed/vog5YhuaKKg' },
          { id: 'l5', title: 'Tipos de endulzantes. Los polialcoholes', duration: '1:57', videoUrl: 'https://www.youtube.com/embed/v8l82BY4tnE' },
          { id: 'l6', title: 'Tipos de endulzantes. Azúcares raros', duration: '1:26', videoUrl: 'https://www.youtube.com/embed/Jy7gOyhixVA' },
          { id: 'l7', title: 'Tipos de endulzantes. Edulcorantes artificiales', duration: '1:09', videoUrl: 'https://www.youtube.com/embed/KALVp5KDxEY' },
          { id: 'l8', title: 'Tipos de endulzantes. Endulzantes naturales NO calóricos', duration: '4:00', videoUrl: 'https://www.youtube.com/embed/-zza8-EE9M8' },
          { id: 'l9', title: 'El gluten y la contaminación cruzada', duration: '3:09', videoUrl: 'https://www.youtube.com/embed/XSdQpc3VH1Q' }
        ]
      },
      {
        id: 'm2',
        title: 'Módulo 2: Harinas Funcionales y Ghee',
        lessons: [
          { id: 'l10', title: 'Harinas funcionales. Formulación harina todo uso sin gluten', duration: '5:27', videoUrl: 'https://www.youtube.com/embed/Meo3gVWI3vM' },
          { id: 'l11', title: 'Harinas funcionales. Realización del harina todo uso sin gluten', duration: '1:34', videoUrl: 'https://www.youtube.com/embed/wnA58I-BZHk' },
          { id: 'l12', title: 'Harinas funcionales. Modo de preparación del harina de almendras', duration: '3:26', videoUrl: 'https://www.youtube.com/embed/iN5K24akmkQ' },
          { id: 'l13', title: 'Harinas funcionales. Modo de conservación del harina de almendras', duration: '0:51', videoUrl: 'https://www.youtube.com/embed/TE5qlfr29vM' },
          { id: 'l14', title: 'El ghee y sus beneficios para la salud', duration: '1:32', videoUrl: 'https://www.youtube.com/embed/nomMq-H0-nA' },
          { id: 'l15', title: 'Cálculo de la merma del ghee', duration: '1:30', videoUrl: 'https://www.youtube.com/embed/FNZ10HS7ZRE' },
          { id: 'l16', title: 'Modo de preparación del ghee', duration: '5:05', videoUrl: 'https://www.youtube.com/embed/_H7M0sfjW-0' },
          { id: 'l17', title: 'Modo de conservación del ghee', duration: '0:40', videoUrl: 'https://www.youtube.com/embed/6mhRUQcBGEY' },
          { id: 'l18', title: 'Cálculo de la merma del ghee', duration: '1:30', videoUrl: 'https://www.youtube.com/embed/jtVBvopDGKQ' }
        ]
      },
      {
        id: 'm3',
        title: 'Módulo 3: Recetas (Panqué, Coffee Cake y Torta)',
        lessons: [
          { id: 'l19', title: 'Masas batidas y horneados. Consejos de horneado', duration: '3:17', videoUrl: 'https://www.youtube.com/embed/KgaTHBt-guc' },
          { id: 'l20', title: 'Panqué de vainilla y chocolate. Ingredientes a utilizar', duration: '0:29', videoUrl: 'https://www.youtube.com/embed/NRozl2SVr8Y' },
          { id: 'l21', title: 'Panqué de vainilla y chocolate. Modo de preparación del panqué', duration: '5:15', videoUrl: 'https://www.youtube.com/embed/WwZ5RmDal2Q' },
          { id: 'l22', title: 'Preparación del ganache de chocolate', duration: '2:42', videoUrl: 'https://www.youtube.com/embed/BbsBX5nDoyc' },
          { id: 'l23', title: 'Panqué de vainilla y chocolate. Presentación final', duration: '0:40', videoUrl: 'https://www.youtube.com/embed/F3XpO4cfdRo' },
          { id: 'l24', title: 'Coffee Cake de arándanos y almendras', duration: '0:21', videoUrl: 'https://www.youtube.com/embed/LSg8bq4gbFI' },
          { id: 'l25', title: 'Coffee Cake. Modo de preparación de la torta', duration: '6:24', videoUrl: 'https://www.youtube.com/embed/t66GGURjsPs' },
          { id: 'l26', title: 'Coffee Cake. Modo de preparación del topping', duration: '2:36', videoUrl: 'https://www.youtube.com/embed/g2Ph3BDaRvU' },
          { id: 'l27', title: 'Coffee Cake de arándanos y almendras. Presentación final', duration: '1:14', videoUrl: 'https://www.youtube.com/embed/3oKWYRHTWwI' },
          { id: 'l28', title: 'Torta de zanahoria glaseada. Ingredientes a utilizar para la torta', duration: '0:34', videoUrl: 'https://www.youtube.com/embed/_RWirVBStUM' },
          { id: 'l29', title: 'Modo de preparación de la torta de zanahoria', duration: '6:15', videoUrl: 'https://www.youtube.com/embed/6fMBLomyhmY' },
          { id: 'l30', title: 'Ingredientes a utilizar para el glaseado de la torta de zanahoria', duration: '0:55', videoUrl: 'https://www.youtube.com/embed/bE4rhcZQHqM' },
          { id: 'l31', title: 'Torta de zanahoria. Ingredientes a utilizar para el glaseado', duration: '0:55', videoUrl: 'https://www.youtube.com/embed/7QzCiH8sbD0' },
          { id: 'l32', title: 'Torta de zanahoria. Modo de preparación del glaseado', duration: '4:41', videoUrl: 'https://www.youtube.com/embed/S4p5SAddzv8' },
          { id: 'l33', title: 'Torta de zanahoria. Presentación final', duration: '3:01', videoUrl: 'https://www.youtube.com/embed/1Axjg2m7Q5k' }
        ]
      },
      {
        id: 'm4',
        title: 'Módulo 4: Cookies y Brownies',
        lessons: [
          { id: 'l34', title: 'Cookies chips de chocolate. Ingredientes a utilizar', duration: '1:06', videoUrl: 'https://www.youtube.com/embed/9LpngzBDDDY' },
          { id: 'l35', title: 'Modo de preparación de las galletas', duration: '6:33', videoUrl: 'https://www.youtube.com/embed/6IUQJcws9yc' },
          { id: 'l36', title: 'Cookies chips de chocolate. Armado, reposo y horneado', duration: '4:41', videoUrl: 'https://www.youtube.com/embed/4akdx60GmgY' },
          { id: 'l37', title: 'Cookies chips de chocolate. Presentación final', duration: '0:49', videoUrl: 'https://www.youtube.com/embed/eamj03vVwXM' },
          { id: 'l38', title: 'Brownies. Ingredientes a utilizar', duration: '0:41', videoUrl: 'https://www.youtube.com/embed/M1c-tJlMiZg' },
          { id: 'l39', title: 'Brownies. Modo de preparación y horneado', duration: '7:39', videoUrl: 'https://www.youtube.com/embed/aAnC9yt15IQ' },
          { id: 'l40', title: 'Brownies. Presentación final', duration: '1:23', videoUrl: 'https://www.youtube.com/embed/uGEF_bGvILw' },
          { id: 'l41', title: 'Agradecimientos y despedida', duration: '1:04', videoUrl: 'https://www.youtube.com/embed/Jp6BgmJDfkg' }
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