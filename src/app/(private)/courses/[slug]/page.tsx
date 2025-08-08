interface CoursePageProps {
	params: Promise<{ slug: string }>
}

const CoursePage = async ({ params }: CoursePageProps) => {
	const { slug } = await params
	const decodedSlug = decodeURIComponent(slug)

	return <div>{decodedSlug}</div>
}

export default CoursePage
