import type { CourseEnrollment, CourseWithDetails } from '@studyx/types'
import { EmptyCard } from '@studyx/ui/common'
import { BookOpenIcon } from 'lucide-react'

import { CourseCard } from './components/CourseCard/CourseCard'

interface CourseListProps {
  courses?: CourseWithDetails[]
  enrollments?: CourseEnrollment[]
  hasActiveFilters: boolean
}

export function CourseList({
  courses = [],
  enrollments = [],
  hasActiveFilters,
}: CourseListProps) {
  const getEnrollment = (courseId: number) => enrollments.find(e => e.course_id === courseId)

  if (courses.length === 0) {
    return (
      <EmptyCard
        icon={<BookOpenIcon size={16} />}
        title={hasActiveFilters ? 'Курсів не знайдено' : 'Курси ще не додані'}
        description={
          hasActiveFilters
            ? 'Спробуйте змінити параметри фільтрації.'
            : 'Створіть перший курс або поверніться пізніше.'
        }
      />
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 pt-0.5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            enrollment={getEnrollment(course.id)}
          />
        ))}
      </div>
    </div>
  )
}
