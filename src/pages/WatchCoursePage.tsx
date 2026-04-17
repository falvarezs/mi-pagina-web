import { useEffect, useState, useCallback } from 'react';
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
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [savingProgress, setSavingProgress] = useState(false);

  const course = courses.find(c => c.id === Number(courseId));
  const allLessons = course ? course.modules.flatMap(m => m.lessons) : [];
  const currentLesson = allLessons[activeLesson];

  // Calcular progreso
  const progressPercent = allLessons.length > 0
    ? Math.round((completedLessons.size / allLessons.length) * 100)
    : 0;

  // Verificar acceso y cargar progreso
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const uid = sessionData.session?.user?.id;
        if (!uid || !course) {
          setCourseAllowed(false);
          setCheckingAccess(false);
          return;
        }

        setUserId(uid);

        const { data, error } = await supabase
          .from('purchases')
          .select('status')
          .eq('user_id', uid)
          .eq('course_id', Number(course.id))
          .eq('status', 'approved')
          .maybeSingle();

        if (error || !data) {
          setCourseAllowed(false);
        } else {
          setCourseAllowed(true);

          // Cargar progreso guardado
          const { data: progress } = await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', uid)
            .eq('course_id', Number(courseId));

          if (progress) {
            setCompletedLessons(new Set(progress.map(p => p.lesson_id)));
          }
        }
      } catch {
        setCourseAllowed(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [course, courseId]);

  // Marcar lección como completada
  const markAsCompleted = useCallback(async (lessonId: string) => {
    if (!userId || completedLessons.has(lessonId)) return;

    setSavingProgress(true);
    try {
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          course_id: Number(courseId),
          lesson_id: lessonId,
          completed: true
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      setCompletedLessons(prev => new Set([...prev, lessonId]));
    } catch (err) {
      console.error('Error guardando progreso:', err);
    } finally {
      setSavingProgress(false);
    }
  }, [userId, courseId, completedLessons]);

  // Cambiar lección
  const changeLesson = (index: number) => {
    // Marcar la lección actual como completada al cambiar
    if (currentLesson) {
      markAsCompleted(currentLesson.id);
    }
    setActiveLesson(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pantalla: Curso no encontrado
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-[#FF6B6B] text-white px-6 py-3 rounded-xl hover:bg-[#e55a5a] transition-all cursor-pointer"
          >
            Volver a Mis Cursos
          </button>
        </div>
      </div>
    );
  }

  // Pantalla: Verificando acceso
  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center text-gray-200">
          <div className="w-10 h-10 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando acceso al curso...</p>
        </div>
      </div>
    );
  }

  // Pantalla: Sin acceso
  if (!courseAllowed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-lg">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Acceso restringido</h2>
          <p className="text-gray-300 mb-6">
            Este curso todavía no está activo para tu cuenta. Si ya enviaste el comprobante, espera a que aprobemos tu pago.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="cursor-pointer bg-[#FF6B6B] text-white px-6 py-3 rounded-xl hover:bg-[#e55a5a] transition-all"
          >
            Volver a Mis Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">

      {/* Video Player */}
      <div className="w-full bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              key={currentLesson?.id}
              className="absolute top-0 left-0 w-full h-full"
              src={currentLesson?.videoUrl
                ? `${currentLesson.videoUrl}?autoplay=1&rel=0`
                : `${course.trailerUrl}?autoplay=1&rel=0`
              }
              title={currentLesson?.title || course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-4">

            {/* Info de la lección */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <p className="text-[#FF6B6B] text-sm uppercase tracking-wider mb-2 font-semibold">
                {course.title}
              </p>
              <h1 className="text-white text-2xl font-bold mb-3">
                {currentLesson?.title || 'Introducción'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {currentLesson?.duration || ''}
                </span>
                <span>Lección {activeLesson + 1} de {allLessons.length}</span>
                {completedLessons.has(currentLesson?.id || '') && (
                  <span className="flex items-center gap-1 text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Completada
                  </span>
                )}
                {savingProgress && (
                  <span className="text-yellow-400 text-xs">Guardando...</span>
                )}
              </div>
            </div>

            {/* Botón marcar completada + navegación */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Marcar como vista */}
              <button
                onClick={() => currentLesson && markAsCompleted(currentLesson.id)}
                disabled={completedLessons.has(currentLesson?.id || '')}
                className={`cursor-pointer py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  completedLessons.has(currentLesson?.id || '')
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {completedLessons.has(currentLesson?.id || '') ? 'Ya vista ✓' : 'Marcar como vista'}
              </button>

              {/* Anterior */}
              <button
                onClick={() => changeLesson(Math.max(0, activeLesson - 1))}
                disabled={activeLesson === 0}
                className={`cursor-pointer py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeLesson === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                ← Anterior
              </button>

              {/* Siguiente */}
              <button
                onClick={() => changeLesson(Math.min(allLessons.length - 1, activeLesson + 1))}
                disabled={activeLesson === allLessons.length - 1}
                className={`cursor-pointer py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeLesson === allLessons.length - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                Siguiente →
              </button>
            </div>

            {/* Barra de progreso */}
            <div className="bg-gray-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-semibold text-sm">Tu Progreso</span>
                <span className="text-[#F59E0B] font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs">
                {completedLessons.size} de {allLessons.length} lecciones completadas
              </p>

              {progressPercent === 100 && (
                <div className="mt-3 bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-bold">
                    🎉 ¡Felicitaciones! Completaste el curso
                  </p>
                </div>
              )}
            </div>

            {/* Descripción del curso */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">Sobre este curso</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {course.fullDescription}
              </p>
            </div>
          </div>

          {/* Lista de lecciones */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-white font-bold text-lg">Contenido</h3>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                  {completedLessons.size}/{allLessons.length}
                </span>
              </div>

              {/* Mini barra de progreso */}
              <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4 mx-2" style={{ width: 'calc(100% - 16px)' }}>
                <div
                  className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    {/* Título del módulo */}
                    <div className="px-3 py-2">
                      <p className="text-[#F59E0B] text-xs uppercase tracking-wider font-bold">
                        Módulo {moduleIndex + 1}
                      </p>
                      <p className="text-gray-300 text-sm font-medium">
                        {module.title}
                      </p>
                    </div>

                    {/* Lecciones */}
                    {module.lessons.map((lesson) => {
                      const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                      const isActive = globalIndex === activeLesson;
                      const isCompleted = completedLessons.has(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => changeLesson(globalIndex)}
                          className={`cursor-pointer w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#FF6B6B]/20 to-[#F59E0B]/20 border border-[#FF6B6B]/30'
                              : 'hover:bg-gray-700'
                          }`}
                        >
                          {/* Icono play o check */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isActive
                              ? 'bg-[#FF6B6B] text-white'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            )}
                          </div>

                          {/* Info de la lección */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${
                              isActive ? 'text-white font-semibold' : 'text-gray-300'
                            }`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lesson.duration}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Botón volver */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="cursor-pointer w-full py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
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