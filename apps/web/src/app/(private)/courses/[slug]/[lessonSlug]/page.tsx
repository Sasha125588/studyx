import { Card, CardContent } from '@/components/ui/card'

import { LessonPageMain } from './(components)/LessonPage/LessonPage'
import { getLessonBySlug } from '@/shared/api'

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

	const { data, error } = await getLessonBySlug(decodedCourseSlug, decodedLessonSlug)

	if (error) {
		return <ErrorCard message='Не вдалося завантажити заняття. Спробуйте оновити сторінку.' />
	}

	if (!data) {
		return <NotFoundCard />
	}

	return <LessonPageMain data={data} />
}

export default LessonPage
