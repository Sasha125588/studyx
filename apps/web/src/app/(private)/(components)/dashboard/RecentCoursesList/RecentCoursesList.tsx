import type { ContinueLearningCourse } from '@studyx/types'

import { RecentCoursesItem } from './components/CoursesItem/RecentCoursesItem'

interface RecentCoursesListProps {
	recentCourses: ContinueLearningCourse[]
}

export const RecentCoursesList = ({ recentCourses }: RecentCoursesListProps) => {
	const courses = Array.isArray(recentCourses) ? recentCourses : []

	return (
		<div className='grid w-full gap-4 md:grid-cols-2'>
			{courses.slice(0, 4).map(course => (
				<RecentCoursesItem
					key={course.id}
					course={course}
				/>
			))}
		</div>
	)
}
