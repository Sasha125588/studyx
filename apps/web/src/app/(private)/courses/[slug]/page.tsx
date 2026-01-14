import type { CourseWithDetails } from '@studyx/types'
import { ErrorCard, NotFoundCard } from '@studyx/ui/common'
import { XIcon } from 'lucide-react'

import { CoursePageMain } from './(components)/CoursePage/CoursePage'
import { getCourse, getRoadmapPositions, getUserId } from '@/shared/api'

const CoursePage = async (props: PageProps<'/courses/[slug]'>) => {
	const { slug } = await props.params
	const decodedSlug = decodeURIComponent(slug)

	const userId = (await getUserId())!

	const getCourseResponse = await getCourse(decodedSlug)

	if (getCourseResponse.status === 404) {
		return (
			<NotFoundCard
				title='404 - Курс не знайдено'
				description='Ми шукали всюди, але такого курсу не існує.'
			/>
		)
	}

	if (getCourseResponse.error) {
		return (
			<ErrorCard
				icon={<XIcon size={16} />}
				title='Не вдалося завантажити курс'
				description={getCourseResponse.error?.value?.message ?? 'Спробуйте оновити сторінку.'}
			/>
		)
	}

	const course = getCourseResponse.data as unknown as CourseWithDetails

	const savedPositions = await getRoadmapPositions(userId, getCourseResponse.data.id)

	return (
		<CoursePageMain
			course={course}
			savedPositions={savedPositions}
			userId={userId}
		/>
	)
}

export default CoursePage
