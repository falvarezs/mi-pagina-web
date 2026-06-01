import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import { CourseCard } from '../components/CourseCard';
import { supabase } from '../lib/supabaseClient';

interface CoursesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const ACTIVE_COURSE_IDS = [1];

type FilterType = 'all' | 'active' | 'coming-soon';

// ═══════════════════════════════════════════════════════════════════
// ESTILOS INLINE PARA FILTROS (Safari iOS fix)
// ═══════════════════════════════════════════════════════════════════

const filterButtonStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '10px 18px',
  backgroundColor: active ? '#FF6B6B' : '#ffffff',
  color: active ? '#ffffff' : '#374151',
  fontWeight: 600,
  borderRadius: '9999px',
  border: active ? '1px solid #FF6B6B' : '1px solid #e5e7eb',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: "'Montserrat', sans-serif",
  transition: 'all 0.2s',
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  boxShadow: active ? '0 4px 6px -1px rgba(255, 107, 107, 0.3)' : 'none',
});

// ═══════════════════════════════════════════════════════════════════

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  const [approvedCourseIds, setApprovedCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const checkPurchases = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) {
          setLoading(false);
          return;
        }

        const { data: purchases } = await supabase
          .from('purchases')
          .select('course_id, status')
          .eq('user_id', userId)
          .eq('status', 'approved');

        if (purchases) {
          setApprovedCourseIds(purchases.map(p => p.course_id));
        }
      } catch {
        // Si no está logueado no muestra badges
      } finally {
        setLoading(false);
      }
    };

    checkPurchases();
  }, []);

  const handleViewCourse = (slug: string, courseId: number) => {
    if (approvedCourseIds.includes(courseId)) {
      onNavigate('watch-course', { courseId: String(courseId) });
    } else {
      onNavigate('course', { slug });
    }
  };

  // ── Contadores ──────────────────────────────────────────────────
  const activeCourses = courses.filter(c => ACTIVE_COURSE_IDS.includes(c.id));
  const comingSoonCourses = courses.filter(c => !ACTIVE_COURSE_IDS.includes(c.id));

  // ── Cursos filtrados ────────────────────────────────────────────
  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'active') return ACTIVE_COURSE_IDS.includes(course.id);
    if (filter === 'coming-soon') return !ACTIVE_COURSE_IDS.includes(course.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="text-white py-10 sm:py-14 lg:py-16 px-4"
        style={{ 
          background: 'linear-gradient(to right, #FF6B6B, #F59E0B)',
          backgroundColor: '#FF6B6B'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Catálogo de Cursos
          </h1>
          <p 
            className="text-base sm:text-lg lg:text-xl opacity-90 mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Descubre todos nuestros cursos de repostería profesional
          </p>

          {/* Stats compactos */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                📚 {courses.length} {courses.length === 1 ? 'curso disponible' : 'cursos disponibles'}
              </span>
            </div>
            {activeCourses.length > 0 && (
              <div className="bg-green-500/30 backdrop-blur-sm rounded-full px-4 py-2 border border-green-300/40">
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  ✅ {activeCourses.length} {activeCourses.length === 1 ? 'activo' : 'activos'}
                </span>
              </div>
            )}
            {comingSoonCourses.length > 0 && (
              <div className="bg-amber-400/30 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-200/40">
                <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  🔜 {comingSoonCourses.length} próximamente
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          GRID DE CURSOS
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 lg:py-12">

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => setFilter('all')}
            style={filterButtonStyle(filter === 'all')}
          >
            Todos ({courses.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            style={filterButtonStyle(filter === 'active')}
          >
            ✅ Disponibles ({activeCourses.length})
          </button>
          <button
            onClick={() => setFilter('coming-soon')}
            style={filterButtonStyle(filter === 'coming-soon')}
          >
            🔜 Próximamente ({comingSoonCourses.length})
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Cargando cursos...
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          /* Estado vacío */
          <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">📭</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No hay cursos en esta categoría
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Prueba con otro filtro o vuelve más tarde
            </p>
          </div>
        ) : (
          /* Grid de cursos */
          <>
            <div className="text-sm text-gray-600 mb-5 sm:mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Mostrando <span className="font-semibold text-gray-900">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'curso' : 'cursos'}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewCourse={(slug) => handleViewCourse(slug, course.id)}
                  comingSoon={!ACTIVE_COURSE_IDS.includes(course.id)}
                  isActivated={approvedCourseIds.includes(course.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}