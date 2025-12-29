import type { BlockSubmission, LessonFullContext } from '@studyx/types'

import { ErrorCard } from '@/components/common/ErrorCard/ErrorCard'
import { NotFoundCard } from '@/components/common/NotFoundCard/NotFoundCard'

import { LessonPageMain } from './(components)/LessonPage/LessonPage'
import { getLessonBySlug } from '@/shared/api'
import { getMySubmissions } from '@/shared/api/requests/block-submissions/{userId}/{my}/getUserSubmissions'

const LessonPage = async (props: PageProps<'/courses/[slug]/[lessonSlug]'>) => {
	const { slug, lessonSlug } = await props.params

	const decodedCourseSlug = decodeURIComponent(slug)
	const decodedLessonSlug = decodeURIComponent(lessonSlug)

	const getLessonResponse = await getLessonBySlug(decodedCourseSlug, decodedLessonSlug)

	if (getLessonResponse.error) {
		return (
			<ErrorCard
				title='Не вдалося завантажити заняття'
				description='Спробуйте оновити сторінку.'
			/>
		)
	}

	if (getLessonResponse.status === 404) {
		return (
			<NotFoundCard
				title='404 - Заняття не знайдено'
				description='Схоже, заняття, яке ви шукаєте, не існує.'
			/>
		)
	}

	const submissionsResponse = await getMySubmissions(getLessonResponse.data!.lesson.id)

	const fullLessonData = getLessonResponse.data as unknown as LessonFullContext
	const submissions = submissionsResponse.data as unknown as BlockSubmission[]

	return (
		<LessonPageMain
			data={fullLessonData}
			submissions={submissions}
		/>
	)
}

export default LessonPage
