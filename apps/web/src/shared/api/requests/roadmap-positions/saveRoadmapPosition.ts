'use server'

import { api } from '@/lib/elysia/client'

export type NodePosition = {
	nodeType: 'module' | 'lesson'
	nodeId: number
	positionX: number
	positionY: number
}

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

export const saveRoadmapPositionsBatch = async (courseId: number, positions: NodePosition[]) => {
	const response = await api['roadmap-positions'].batch.post({
		courseId,
		positions
	})

	if (response.error) {
		console.error('Failed to save positions:', response.error)
		throw new Error('Failed to save positions')
	}

	return response.data
}
