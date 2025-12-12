import { Card, CardContent } from '@/components/ui/card'

import { CoursePageMain } from './(components)/CoursePage/CoursePage'
import { getCourse } from '@/shared/api'

interface CoursePageProps {
	params: Promise<{ slug: string }>
}

const CoursePage = async ({ params }: CoursePageProps) => {
	const { slug } = await params
	const decodedSlug = decodeURIComponent(slug)

	const { data: course, error } = await getCourse(decodedSlug)

	if (error) {
		return (
			<Card className='border-destructive/30 bg-destructive/5'>
				<CardContent className='text-destructive py-6'>
					Не вдалося завантажити курс. Спробуйте оновити сторінку.
				</CardContent>
			</Card>
		)
	}

	if (!course) {
		return (
			<Card className='border-amber-200 bg-amber-50'>
				<CardContent className='py-6 text-amber-800'>Курс не знайдено</CardContent>
			</Card>
		)
	}

	return <CoursePageMain course={course} />
}

export default CoursePage
