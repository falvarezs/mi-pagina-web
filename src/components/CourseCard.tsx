import { Course } from '../data/courses';
import { ClockIcon, StarIcon, UsersIcon } from './Icons';

interface CourseCardProps {
  course: Course;
  onViewCourse: (slug: string) => void;
}

export function CourseCard({ course, onViewCourse }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer group">
      <div className="relative overflow-hidden h-52 bg-gradient-to-br from-coral-50 to-amber-50" onClick={() => onViewCourse(course.slug)}>
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-end mb-3">
          <div className="flex items-center gap-1">
            <StarIcon size={16} className="text-amber-400" filled />
            <span className="text-sm font-bold text-gray-900">{course.rating}</span>
            <span className="text-xs text-gray-500">({course.reviewsCount})</span>
          </div>
        </div>
        
        <h3 className="font-display font-bold text-xl text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {course.shortDescription}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 font-medium">
          <span className="flex items-center gap-1.5">
            <ClockIcon size={16} className="text-gray-400" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <UsersIcon size={16} className="text-gray-400" />
            {course.studentsCount}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500 font-medium block mb-0.5">Inversión</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-display font-bold text-coral-600">${course.price}</span>
              <span className="text-sm text-gray-500 font-medium">{course.currency}</span>
            </div>
          </div>
          <button 
            onClick={() => onViewCourse(course.slug)}
            className="px-6 py-3 bg-gradient-to-r from-coral-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
