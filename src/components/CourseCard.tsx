import { useState } from 'react';
import { Course } from '../data/courses';
import { ClockIcon, StarIcon, UsersIcon } from './Icons';

interface CourseCardProps {
  course: Course;
  onViewCourse: (slug: string) => void;
  comingSoon?: boolean;
  isActivated?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// ESTILOS INLINE PARA TODOS LOS BOTONES (Safari iOS fix)
// ═══════════════════════════════════════════════════════════════════

const disabledButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  backgroundColor: '#d1d5db',
  color: '#6b7280',
  fontWeight: 600,
  borderRadius: '12px',
  border: 'none',
  cursor: 'not-allowed',
  fontSize: '14px',
  fontFamily: "'Montserrat', sans-serif",
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  whiteSpace: 'nowrap',
};

const activatedButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  backgroundColor: '#10B981',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: "'Montserrat', sans-serif",
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  WebkitTapHighlightColor: 'transparent',
  whiteSpace: 'nowrap',
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
  backgroundColor: '#FF6B6B',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: "'Montserrat', sans-serif",
  minHeight: '44px',
  WebkitAppearance: 'none',
  appearance: 'none',
  WebkitTapHighlightColor: 'transparent',
  whiteSpace: 'nowrap',
};

const imageAreaStyle: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  height: '208px',
  background: 'linear-gradient(135deg, #FFF1F0 0%, #FEF3C7 100%)',
  backgroundColor: '#FFF1F0',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
};

// ═══════════════════════════════════════════════════════════════════

export function CourseCard({ course, onViewCourse, comingSoon = false, isActivated = false }: CourseCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleImageClick = () => {
    if (!comingSoon) {
      onViewCourse(course.slug);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 
        ${comingSoon ? 'opacity-75' : 'hover:shadow-2xl'} group`}
      style={{ 
        transform: comingSoon ? 'none' : undefined,
      }}
    >

      {/* ══ IMAGEN ══ */}
      {!comingSoon ? (
        <button
          onClick={handleImageClick}
          style={imageAreaStyle}
          className="w-full border-0 p-0 group-hover:shadow-lg transition-shadow"
          aria-label={`Ver detalles de ${course.title}`}
        >
          {!imgError ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-6xl"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)', backgroundColor: '#FF6B6B' }}
            >
              🍰
            </div>
          )}
        </button>
      ) : (
        /* Próximamente - no clickeable */
        <div style={imageAreaStyle} className="w-full cursor-default">
          {!imgError ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover grayscale"
              onError={() => setImgError(true)}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-6xl grayscale opacity-50"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #F59E0B)', backgroundColor: '#FF6B6B' }}
            >
              🍰
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span 
              className="text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)',
                backgroundColor: '#FF6B6B',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Próximamente
            </span>
          </div>
        </div>
      )}

      {/* ══ CONTENIDO ══ */}
      <div className="p-5 sm:p-6">

        {/* Rating */}
        <div className="flex items-center justify-end mb-3">
          <div className="flex items-center gap-1">
            <StarIcon size={16} className="text-amber-400" filled />
            <span className="text-sm font-bold text-gray-900">{course.rating}</span>
            <span className="text-xs text-gray-500">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Título */}
        <h3 
          className="font-bold text-xl text-gray-900 mb-3 leading-tight"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            minHeight: '3.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.title}
        </h3>

        {/* Descripción */}
        <p 
          className="text-gray-600 text-sm mb-5 leading-relaxed"
          style={{ 
            fontFamily: "'Montserrat', sans-serif",
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.shortDescription}
        </p>

        {/* Duración y estudiantes */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 font-medium flex-wrap">
          <span className="flex items-center gap-1.5">
            <ClockIcon size={16} className="text-gray-400" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <UsersIcon size={16} className="text-gray-400" />
            {course.studentsCount}
          </span>
        </div>

        {/* Precio y botón */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-gray-100">

          {/* Precio o badge activado */}
          <div>
            {isActivated ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                ✅ Activado
              </span>
            ) : (
              <>
                <span className="text-sm text-gray-500 font-medium block mb-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>Inversión</span>
                <div className="flex items-baseline gap-1">
                  <span 
                    className="text-3xl font-bold"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      color: '#FF6B6B',
                    }}
                  >
                    ${course.price}
                  </span>
                  <span className="text-sm text-gray-500 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {course.currency}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Botón */}
          {comingSoon ? (
            <button
              disabled
              style={disabledButtonStyle}
            >
              Próximamente
            </button>
          ) : isActivated ? (
            <button
              onClick={() => onViewCourse(course.slug)}
              style={activatedButtonStyle}
            >
              ▶ Ver Curso
            </button>
          ) : (
            <button
              onClick={() => onViewCourse(course.slug)}
              style={primaryButtonStyle}
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  );
}