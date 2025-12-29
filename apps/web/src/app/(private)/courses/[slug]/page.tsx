import type { CourseWithDetails } from '@studyx/types'

import { Card, CardContent } from '@/components/ui/card'

import { CoursePageMain } from './(components)/CoursePage/CoursePage'
import { getCourse, getRoadmapPositions, getUserId } from '@/shared/api'

interface CoursePageProps {
	params: Promise<{ slug: string }>
}

const CoursePage = async ({ params }: CoursePageProps) => {
	const { slug } = await params
	const decodedSlug = decodeURIComponent(slug)

	const userId = (await getUserId())!

	const getCourseResponse = await getCourse(decodedSlug)

	if (getCourseResponse.error) {
		return (
			<Card className='border-destructive/30 bg-destructive/5'>
				<CardContent className='text-destructive py-6'>
					Не вдалося завантажити курс. Спробуйте оновити сторінку.
				</CardContent>
			</Card>
		)
	}

	if (!getCourseResponse.data) {
		return (
			<Card className='border-amber-200 bg-amber-50'>
				<CardContent className='py-6 text-amber-800'>Курс не знайдено</CardContent>
			</Card>
		)
	}

	const course = getCourseResponse.data as unknown as CourseWithDetails

	const savedPositions = await getRoadmapPositions(getCourseResponse.data.id)

	return (
		<CoursePageMain
			course={course}
			savedPositions={savedPositions}
			userId={userId}
		/>
	)
}

export default CoursePage
