import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import { supabase } from '../lib/supabaseClient';

interface DashboardPageProps {
  userEmail: string;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
}

interface Purchase {
  id: number;
  course_id: number;
  status: string;
  created_at: string;
}

interface CourseProgress {
  courseId: number;
  completed: number;
  total: number;
  percent: number;
}

export function DashboardPage({ userEmail, onNavigate, onLogout }: DashboardPageProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<number, CourseProgress>>({});

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
      await loadPurchases();
    };

    initialize();
    const interval = window.setInterval(loadPurchases, 15000);
    const onFocus = () => loadPurchases();
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('purchases-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'purchases',
        filter: `user_id=eq.${userId}`,
      }, () => {
        loadPurchases();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const loadPurchases = async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Cargar compras
      const { data: purchasesData } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id);

      if (purchasesData) {
        setPurchases(purchasesData);

        // Cargar progreso de cada curso aprobado
        const approvedIds = purchasesData
          .filter(p => p.status === 'approved')
          .map(p => p.course_id);

        if (approvedIds.length > 0) {
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('course_id, lesson_id')
            .eq('user_id', user.id)
            .in('course_id', approvedIds);

          const newProgressMap: Record<number, CourseProgress> = {};

          approvedIds.forEach(courseId => {
            const course = courses.find(c => c.id === courseId);
            if (!course) return;

            const totalLessons = course.modules.reduce(
              (acc, mod) => acc + mod.lessons.length, 0
            );
            const completedLessons = progressData
              ? progressData.filter(p => p.course_id === courseId).length
              : 0;

            newProgressMap[courseId] = {
              courseId,
              completed: completedLessons,
              total: totalLessons,
              percent: totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0
            };
          });

          setProgressMap(newProgressMap);
        }
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const approvedCourseIds = new Set(
    purchases.filter(p => p.status === 'approved').map(p => p.course_id)
  );

  const approvedCourses = purchases
    .filter(p => p.status === 'approved')
    .map(p => {
      const course = courses.find(c => c.id === p.course_id);
      return course ? { ...course, purchaseDate: p.created_at } : null;
    })
    .filter(Boolean);

  const pendingCourses = purchases
    .filter(p => p.status === 'pending' && !approvedCourseIds.has(p.course_id))
    .map(p => {
      const course = courses.find(c => c.id === p.course_id);
      return course ? { ...course, purchaseDate: p.created_at } : null;
    })
    .filter(Boolean);

  const rejectedCourses = purchases
    .filter(p => p.status === 'rejected')
    .map(p => {
      const course = courses.find(c => c.id === p.course_id);
      return course ? { ...course, purchaseDate: p.created_at } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Mi Panel de Aprendizaje
              </h1>
              <p className="opacity-90 text-sm">{userEmail}</p>
            </div>
            <div className="flex items-center gap-3">
              {refreshing && (
                <span className="text-xs text-white/80">Actualizando...</span>
              )}
              <button
                onClick={onLogout}
                className="cursor-pointer px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-all"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando tus cursos...</p>
          </div>
        ) : (
          <>
            {/* Sin cursos */}
            {approvedCourses.length === 0 && pendingCourses.length === 0 && rejectedCourses.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Aún no tienes cursos
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Explora nuestro catálogo y comienza tu camino en la repostería
                </p>
                <button
                  onClick={() => onNavigate('courses')}
                  className="cursor-pointer px-8 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Explorar Cursos
                </button>
              </div>
            )}

            {/* Cursos aprobados */}
            {approvedCourses.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  ✅ Mis Cursos
                </h2>
                <div className="grid gap-6">
                  {approvedCourses.map((course: any) => {
                    const progress = progressMap[course.id];
                    const percent = progress?.percent ?? 0;
                    const completed = progress?.completed ?? 0;
                    const total = progress?.total ?? 0;

                    return (
                      <div key={course.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                        <div className="flex flex-col sm:flex-row">

                          {/* Thumbnail */}
                          <div className="relative w-full sm:w-52 h-44 sm:h-auto flex-shrink-0">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            {percent === 100 && (
                              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                <div className="text-center text-white">
                                  <div className="text-3xl mb-1">🎉</div>
                                  <p className="text-xs font-bold">¡Completado!</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                  ✅ Activado
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {course.duration}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 mb-1">
                                {course.title}
                              </h3>
                              <p className="text-gray-500 text-sm mb-4">
                                {course.shortDescription}
                              </p>

                              {/* Barra de progreso */}
                              <div className="mb-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-500 font-semibold">
                                    Progreso del curso
                                  </span>
                                  <span className="text-xs font-bold text-[#FF6B6B]">
                                    {percent}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {completed} de {total} lecciones completadas
                                </p>
                              </div>
                            </div>

                            {/* Botón ver curso */}
                            <button
                              onClick={() => onNavigate('watch-course', { courseId: String(course.id) })}
                              className="cursor-pointer mt-4 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              {percent > 0 ? 'Continuar Curso' : 'Comenzar Curso'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cursos pendientes */}
            {pendingCourses.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  ⏳ Pagos en Revisión
                </h2>
                <div className="space-y-3">
                  {pendingCourses.map((course: any) => (
                    <div key={course.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{course.title}</h3>
                        <p className="text-amber-700 text-sm">
                          Tu pago está siendo verificado (24-48 horas hábiles)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cursos rechazados */}
            {rejectedCourses.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  ❌ Pagos Rechazados
                </h2>
                <div className="space-y-3">
                  {rejectedCourses.map((course: any) => (
                    <div key={course.id} className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{course.title}</h3>
                        <p className="text-red-700 text-sm mb-3">
                          Tu comprobante fue rechazado. Por favor envía uno nuevo.
                        </p>
                        <button
                          onClick={() => onNavigate('checkout', { courseId: String(course.id) })}
                          className="cursor-pointer px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Enviar nuevo comprobante
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}