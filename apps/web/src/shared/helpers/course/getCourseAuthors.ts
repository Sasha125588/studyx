import type { CourseAuthorWithUser } from '@studyx/database'

export const getCourseAuthors = (authors?: CourseAuthorWithUser[]) => {
	if (!authors || authors.length === 0) return 'Unknown'

	return authors.map(author => author.author_name || author.user?.name || 'Unknown').join(', ')
}
