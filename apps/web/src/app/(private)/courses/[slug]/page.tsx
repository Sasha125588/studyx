import { CoursePageMain } from './(components)/CoursePage/CoursePage'
import { getCourse } from '@/shared/api'

interface CoursePageProps {
	params: Promise<{ slug: string }>
}

const CoursePage = async ({ params }: CoursePageProps) => {
	const { slug } = await params
	const decodedSlug = decodeURIComponent(slug)

	const courseResponse = await getCourse(decodedSlug)

	if (!courseResponse.data) {
		return <div>Course not found</div>
	}

	return <CoursePageMain course={courseResponse.data} />
}

export default CoursePage
