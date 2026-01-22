import type { ContinueLearningCourse } from '@studyx/types'
import { EmptyCard } from '@studyx/ui/common'
import { SparklesIcon } from 'lucide-react'

import { RecentCoursesItem } from './components/CoursesItem/RecentCoursesItem'

interface RecentCoursesListProps {
  recentCourses: ContinueLearningCourse[]
}

export function RecentCoursesList({ recentCourses }: RecentCoursesListProps) {
  if (!recentCourses || recentCourses.length === 0) {
    return (
      <EmptyCard
        icon={<SparklesIcon size={16} />}
        title="Порожньо, але ненадовго"
        description="Ви ще не почали жодного курсу. Саме час обрати перший."
      />
    )
  }

  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      {recentCourses.slice(0, 4).map(course => (
        <RecentCoursesItem
          key={course.id}
          course={course}
        />
      ))}
    </div>
  )
}
