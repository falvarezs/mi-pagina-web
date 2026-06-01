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

// ═══════════════════════════════════════════════════════════════════
// ESTILOS INLINE PARA TODOS LOS BOTONES (Safari iOS fix)
// ═══════════════════════════════════════════════════════════════════

const logoutButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 20px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s',
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const exploreButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '14px 32px',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
  backgroundColor: '#FF6B6B',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  minHeight: '48px',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const watchCourseButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 32px',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
  backgroundColor: '#FF6B6B',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  minHeight: '48px',
  width: '100%',
  marginTop: '16px',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const primaryActionButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  backgroundColor: '#FF6B6B',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '13px',
  minHeight: '40px',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const dangerButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '13px',
  minHeight: '40px',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const outlineDangerButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  backgroundColor: '#ffffff',
  color: '#dc2626',
  fontWeight: 600,
  borderRadius: '8px',
  border: '1px solid #dc2626',
  cursor: 'pointer',
  fontSize: '13px',
  minHeight: '40px',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const outlineButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  backgroundColor: '#ffffff',
  color: '#374151',
  fontWeight: 600,
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
  fontSize: '13px',
  minHeight: '40px',
  transition: 'all 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

// ═══════════════════════════════════════════════════════════════════

export function DashboardPage({ userEmail, onNavigate, onLogout }: DashboardPageProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<number, CourseProgress>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadPurchases = async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: purchasesData } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id);

      if (purchasesData) {
        setPurchases(purchasesData);

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

  // ── Eliminar compra rechazada (para reintentar) ───────────────
  const handleDeleteRejected = async (purchaseId: number, courseTitle: string) => {
    const confirmar = window.confirm(
      `¿Eliminar el registro rechazado de "${courseTitle}"?\n\nEsto te permitirá enviar un nuevo intento de compra.`
    );

    if (!confirmar) return;

    setDeletingId(purchaseId);
    try {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId);

      if (error) {
        alert('No se pudo eliminar: ' + error.message);
      } else {
        await loadPurchases();
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el registro');
    } finally {
      setDeletingId(null);
    }
  };

  const approvedCourseIds = new Set(
    purchases.filter(p => p.status === 'approved').map(p => p.course_id)
  );

  const approvedCourses = purchases
    .filter(p => p.status === 'approved')
    .map(p => {
      const course = courses.find(c => c.id === p.course_id);
      return course ? { ...course, purchaseDate: p.created_at, purchaseId: p.id } : null;
    })
    .filter(Boolean);

  const pendingCourses = purchases
    .filter(p => p.status === 'pending' && !approvedCourseIds.has(p.course_id))
    .map(p => {
      const course = courses.find(c => c.id === p.course_id);
      return course ? { ...course, purchaseDate: p.created_at, purchaseId: p.id } : null;
    })
    .filter(Boolean);

  const rejectedCourses = purchases
    .filter(p => p.status === 'rejected')
    .map(p => {
      const course = courses.find(c => c.id === p.course_id);
      return course ? { ...course, purchaseDate: p.created_at, purchaseId: p.id } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="text-white py-8 sm:py-12 px-4"
        style={{ 
          background: 'linear-gradient(to right, #FF6B6B, #F59E0B)',
          backgroundColor: '#FF6B6B'
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Mi Panel de Aprendizaje
              </h1>
              <p className="opacity-90 text-sm break-all sm:break-words" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {userEmail}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {refreshing && (
                <span className="text-xs text-white/80 hidden sm:inline">Actualizando...</span>
              )}
              <button
                onClick={onLogout}
                style={logoutButtonStyle}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando tus cursos...</p>
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════════════════════════
                SIN CURSOS
            ═══════════════════════════════════════════════════════════════ */}
            {approvedCourses.length === 0 && pendingCourses.length === 0 && rejectedCourses.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 text-center">
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
                  style={exploreButtonStyle}
                >
                  Explorar Cursos
                </button>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                CURSOS APROBADOS
            ═══════════════════════════════════════════════════════════════ */}
            {approvedCourses.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ✅ Mis Cursos
                </h2>
                <div className="grid gap-6">
                  {approvedCourses.map((course: any) => {
                    const progress = progressMap[course.id];
                    const percent = progress?.percent ?? 0;
                    const completed = progress?.completed ?? 0;
                    const total = progress?.total ?? 0;
                    const hasImgError = imgErrors[course.id];

                    return (
                      <div key={course.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                        <div className="flex flex-col sm:flex-row">

                          <div className="relative w-full sm:w-52 h-44 sm:h-auto flex-shrink-0 bg-gray-100">
                            {!hasImgError ? (
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                onError={() => setImgErrors(prev => ({ ...prev, [course.id]: true }))}
                              />
                            ) : (
                              <div 
                                className="w-full h-full flex items-center justify-center text-5xl"
                                style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)', backgroundColor: '#FF6B6B' }}
                              >
                                🍰
                              </div>
                            )}
                            {percent === 100 && (
                              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                <div className="text-center text-white">
                                  <div className="text-3xl mb-1">🎉</div>
                                  <p className="text-xs font-bold">¡Completado!</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                  ✅ Activado
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {course.duration}
                                </span>
                              </div>
                              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                                {course.title}
                              </h3>
                              <p className="text-gray-500 text-sm mb-4">
                                {course.shortDescription}
                              </p>

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
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${percent}%`,
                                      background: 'linear-gradient(to right, #FF6B6B, #F59E0B)',
                                      backgroundColor: '#FF6B6B'
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {completed} de {total} lecciones completadas
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => onNavigate('watch-course', { courseId: String(course.id) })}
                              style={watchCourseButtonStyle}
                            >
                              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              <span>{percent > 0 ? 'Continuar Curso' : 'Comenzar Curso'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                CURSOS PENDIENTES
            ═══════════════════════════════════════════════════════════════ */}
            {pendingCourses.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ⏳ Pagos en Revisión
                </h2>
                <div className="space-y-3">
                  {pendingCourses.map((course: any) => (
                    <div key={course.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
                      <div className="flex items-start gap-3 sm:gap-4 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{course.title}</h3>
                          <p className="text-amber-700 text-xs sm:text-sm">
                            Tu pago está siendo verificado (24-48 horas hábiles)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => onNavigate('course', { slug: course.slug })}
                          style={outlineButton}
                        >
                          Ver detalle del curso
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                CURSOS RECHAZADOS (con botón eliminar)
            ═══════════════════════════════════════════════════════════════ */}
            {rejectedCourses.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ❌ Pagos Rechazados
                </h2>
                <div className="space-y-3">
                  {rejectedCourses.map((course: any) => (
                    <div key={course.id} className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5">
                      <div className="flex items-start gap-3 sm:gap-4 mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{course.title}</h3>
                          <p className="text-red-700 text-xs sm:text-sm">
                            Tu intento de compra fue rechazado.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => onNavigate('checkout', { courseId: String(course.id) })}
                          style={primaryActionButton}
                        >
                          🔄 Reintentar compra
                        </button>
                        <button
                          onClick={() => handleDeleteRejected(course.purchaseId, course.title)}
                          disabled={deletingId === course.purchaseId}
                          style={{
                            ...outlineDangerButton,
                            opacity: deletingId === course.purchaseId ? 0.5 : 1,
                            cursor: deletingId === course.purchaseId ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {deletingId === course.purchaseId ? '⏳ Eliminando...' : '🗑️ Eliminar registro'}
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