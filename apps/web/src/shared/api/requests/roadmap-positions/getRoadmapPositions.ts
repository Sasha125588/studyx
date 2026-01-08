import { api } from '@/lib/elysia/client'

export const getRoadmapPositions = async (userId: string, courseId: number) => {
	const response = await api['roadmap-positions'].get({ query: { userId, courseId } })

	if (response.error) {
		console.error('Failed to get roadmap positions:', response.error)
		throw new Error(response.error.value.message)
	}

	return response.data ?? []
}
