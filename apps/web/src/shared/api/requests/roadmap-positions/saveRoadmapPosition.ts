'use server'

import type { NodePosition } from '@studyx/types'

import { api } from '@/lib/elysia/client'

export const saveRoadmapPosition = async (courseId: number, position: NodePosition) => {
	const response = await api['roadmap-positions'].post({
		courseId,
		...position
	})

	if (response.error) {
		console.error('Failed to save position:', response.error)
		throw new Error('Failed to save position')
	}

	return response.data
}
