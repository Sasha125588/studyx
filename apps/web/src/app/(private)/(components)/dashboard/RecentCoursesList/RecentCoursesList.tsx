import { RecentCoursesItem } from './components/CoursesItem/RecentCoursesItem'
import type { CourseWithModules } from '@/generated/entities.types'

interface RecentCoursesListProps {
	recentCourses: CourseWithModules[]
}

export const RecentCoursesList = ({ recentCourses }: RecentCoursesListProps) => {
	return (
		<div className='grid w-full gap-4 md:grid-cols-2'>
			{recentCourses.slice(0, 4).map(course => (
				<RecentCoursesItem
					key={course.id}
					course={course}
				/>
			))}
		</div>
	)
}
