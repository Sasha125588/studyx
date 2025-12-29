import type { User } from '@studyx/types'

export const getCourseAuthors = (authors: User[]) => {
	if (!authors || authors.length === 0) return 'Unknown'

	return authors.map(author => author.name ?? author.email ?? 'Unknown').join(', ')
}
