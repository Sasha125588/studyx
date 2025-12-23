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

	const { data, error } = await getCourse(decodedSlug)

	if (error) {
		return (
			<Card className='border-destructive/30 bg-destructive/5'>
				<CardContent className='text-destructive py-6'>
					Не вдалося завантажити курс. Спробуйте оновити сторінку.
				</CardContent>
			</Card>
		)
	}

	if (!data) {
		return (
			<Card className='border-amber-200 bg-amber-50'>
				<CardContent className='py-6 text-amber-800'>Курс не знайдено</CardContent>
			</Card>
		)
	}

	const savedPositions = await getRoadmapPositions(data.id)

	return (
		<CoursePageMain
			course={data}
			savedPositions={savedPositions}
			userId={userId}
		/>
	)
}

export default CoursePage
