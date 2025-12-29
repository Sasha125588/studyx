'use server'

import { LessonEditor } from '../(components)/LessonEditor/LessonEditor'

import { getUserId } from '@/shared/api'
import { getCoursesByAuthor } from '@/shared/api/requests/courses/getCoursesByAuthor'

const NewLessonPage = async () => {
	const userId = await getUserId()
	const { data, error } = await getCoursesByAuthor(userId!)

	const coursesData = data?.map(course => course.courses)

	if (error) {
		return <div>Error: {error.value.message}</div>
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Створення уроку</h1>
				<p className='text-muted-foreground mt-1'>
					Використовуйте блоки для створення контенту уроку
				</p>
			</div>

			<LessonEditor courses={coursesData ?? []} />
		</div>
	)
}

export default NewLessonPage
