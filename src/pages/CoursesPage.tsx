import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import { CourseCard } from '../components/CourseCard';
import { supabase } from '../lib/supabaseClient';

interface CoursesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const ACTIVE_COURSE_IDS = [1];

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  const [approvedCourseIds, setApprovedCourseIds] = useState<number[]>([]);

  useEffect(() => {
    const checkPurchases = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) return;

        const { data: purchases } = await supabase
          .from('purchases')
          .select('course_id, status')
          .eq('user_id', userId)
          .eq('status', 'approved');

        if (purchases) {
          setApprovedCourseIds(purchases.map(p => p.course_id));
        }
      } catch {
        // Si no está logueado simplemente no muestra badges
      }
    };

    checkPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Catálogo de Cursos
          </h1>
          <p className="text-xl opacity-90">
            Descubre todos nuestros cursos de repostería profesional
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-sm text-gray-600 mb-6">
          {courses.length} {courses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.id} className="relative">

              {/* Badge Aprobado */}
              {approvedCourseIds.includes(course.id) && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    ✅ Activado
                  </span>
                </div>
              )}

              <CourseCard
                course={course}
                onViewCourse={(slug) => onNavigate('course', { slug })}
                comingSoon={!ACTIVE_COURSE_IDS.includes(course.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}