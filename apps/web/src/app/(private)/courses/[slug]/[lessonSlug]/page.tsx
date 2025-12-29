import type { BlockSubmission, LessonFullContext } from '@studyx/types'

import { Card, CardContent } from '@/components/ui/card'

import { LessonPageMain } from './(components)/LessonPage/LessonPage'
import { getLessonBySlug } from '@/shared/api'
import { getMySubmissions } from '@/shared/api/requests/block-submissions/{userId}/{my}/getUserSubmissions'

interface LessonPageProps {
	params: Promise<{ slug: string; lessonSlug: string }>
}

const ErrorCard = ({ message }: { message: string }) => (
	<Card className='border-destructive/30 bg-destructive/5'>
		<CardContent className='text-destructive py-6'>{message}</CardContent>
	</Card>
)

const NotFoundCard = () => (
	<Card className='border-amber-200 bg-amber-50'>
		<CardContent className='py-6 text-amber-800'>Заняття не знайдено</CardContent>
	</Card>
)

const LessonPage = async ({ params }: LessonPageProps) => {
	const { slug, lessonSlug } = await params

	const decodedCourseSlug = decodeURIComponent(slug)
	const decodedLessonSlug = decodeURIComponent(lessonSlug)

	const getLessonResponse = await getLessonBySlug(decodedCourseSlug, decodedLessonSlug)

	if (getLessonResponse.error) {
		return <ErrorCard message='Не вдалося завантажити заняття. Спробуйте оновити сторінку.' />
	}

	if (!getLessonResponse.data) {
		return <NotFoundCard />
	}

	const submissionsResponse = await getMySubmissions(getLessonResponse.data.lesson.id)

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
