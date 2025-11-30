import { RecentCoursesItem } from './components/CoursesItem/RecentCoursesItem'
import type { CourseWithModules } from '@/generated/entities.types'

interface RecentCoursesListProps {
	recentCourses: CourseWithModules[]
}

export const RecentCoursesList = ({ recentCourses }: RecentCoursesListProps) => {
	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{recentCourses.map(course => (
				<RecentCoursesItem
					key={course.id}
					course={course}
				/>
			))}
		</div>
	)
}
