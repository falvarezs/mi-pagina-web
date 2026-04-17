import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import { supabase } from '../lib/supabaseClient';

interface WatchCoursePageProps {
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function WatchCoursePage({ courseId, onNavigate }: WatchCoursePageProps) {
  const [courseAllowed, setCourseAllowed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);
  const course = courses.find(c => c.id === Number(courseId));

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId || !course) {
          setCourseAllowed(false);
          setCheckingAccess(false);
          return;
        }

        const { data, error } = await supabase
          .from('purchases')
          .select('status')
          .eq('user_id', userId)
          .eq('course_id', Number(course.id))
          .eq('status', 'approved')
          .maybeSingle();

        if (error || !data) {
          setCourseAllowed(false);
        } else {
          setCourseAllowed(true);
        }
      } catch {
        setCourseAllowed(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [course, courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-[#FF6B6B] text-white px-6 py-3 rounded-xl hover:bg-[#e55a5a] transition-all"
          >
            Volver a Mis Cursos
          </button>
        </div>
      </div>
    );
  }

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center text-gray-200">
          <div className="w-10 h-10 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Verificando acceso al curso...
        </div>
      </div>
    );
  }

  if (!courseAllowed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso restringido</h2>
          <p className="text-gray-300 mb-6">
            Este curso todavía no está activo para tu cuenta. Si ya enviaste el comprobante, espera a que aprobemos tu pago.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-[#FF6B6B] text-white px-6 py-3 rounded-xl hover:bg-[#e55a5a] transition-all"
          >
            Volver a Mis Cursos
          </button>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentLesson = allLessons[activeLesson];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="w-full bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={currentLesson?.videoUrl || course.trailerUrl}
              title={currentLesson?.title || course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 mb-6">
              <p className="text-[#FF6B6B] font-montserrat text-sm uppercase tracking-wider mb-2">
                {course.title}
              </p>
              <h1 className="text-white text-2xl md:text-3xl font-playfair font-bold mb-3">
                {currentLesson?.title || 'Introducción'}
              </h1>
              <div className="flex items-center gap-4 text-gray-400 font-montserrat text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" d="M12 6v6l4 2"/>
                  </svg>
                  {currentLesson?.duration || ''}
                </span>
                <span>Lección {activeLesson + 1} de {allLessons.length}</span>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveLesson(prev => Math.max(0, prev - 1))}
                disabled={activeLesson === 0}
                className={`flex-1 py-3 rounded-xl font-montserrat font-semibold transition-all
                  ${activeLesson === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
              >
                ← Anterior
              </button>
              <button
                onClick={() => setActiveLesson(prev => Math.min(allLessons.length - 1, prev + 1))}
                disabled={activeLesson === allLessons.length - 1}
                className={`flex-1 py-3 rounded-xl font-montserrat font-semibold transition-all
                  ${activeLesson === allLessons.length - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white hover:shadow-lg'
                  }`}
              >
                Siguiente →
              </button>
            </div>

            {currentLesson?.resources && currentLesson.resources.length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-playfair font-bold text-lg mb-4">Recursos descargables</h3>
                <div className="space-y-3">
                  {currentLesson.resources.map((resource, index) => (
                    <a
                      key={resource}
                      href={resource}
                      className="flex items-center justify-between bg-gray-700/60 hover:bg-gray-700 transition-colors rounded-xl px-4 py-3 text-sm text-gray-100"
                      download
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M6 20h12" />
                          </svg>
                        </div>
                        <span>Recurso {index + 1}</span>
                      </div>
                      <span className="text-xs text-gray-400">Descargar</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-playfair font-bold text-lg mb-3">Sobre este curso</h3>
              <p className="text-gray-300 font-montserrat text-sm leading-relaxed">
                {course.fullDescription}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-4 sticky top-24">
              <h3 className="text-white font-playfair font-bold text-lg mb-4 px-2">
                Contenido del Curso
              </h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <div className="px-3 py-2">
                      <p className="text-[#F59E0B] font-montserrat text-xs uppercase tracking-wider font-semibold">
                        Módulo {moduleIndex + 1}
                      </p>
                      <p className="text-gray-300 font-montserrat text-sm font-medium">
                        {module.title}
                      </p>
                    </div>
                    {module.lessons.map((lesson) => {
                      const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                      const isActive = globalIndex === activeLesson;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(globalIndex)}
                          className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all
                            ${isActive
                              ? 'bg-gradient-to-r from-[#FF6B6B]/20 to-[#F59E0B]/20 border border-[#FF6B6B]/30'
                              : 'hover:bg-gray-700'
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${isActive
                              ? 'bg-[#FF6B6B] text-white'
                              : 'bg-gray-700 text-gray-400'
                            }`}>
                            <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-montserrat truncate
                              ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500 font-montserrat">
                              {lesson.duration}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-3 bg-gray-700 text-white rounded-xl font-montserrat font-semibold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Volver a Mis Cursos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}