import type { RoadmapNodeType } from '@studyx/types'

import { supabase } from '../../lib/supabase'

export abstract class RoadmapPositionsService {
	static async getPositions(userId: string, courseId: number) {
		const { data, error } = await supabase
			.from('roadmap_positions')
			.select('*')
			.eq('user_id', userId)
			.eq('course_id', courseId)

		if (error) throw new Error(error.message)
		return data
	}

	static async savePosition(
		userId: string,
		courseId: number,
		nodeType: RoadmapNodeType,
		nodeId: number,
		positionX: number,
		positionY: number
	) {
		const { data, error } = await supabase
			.from('roadmap_positions')
			.upsert(
				{
					user_id: userId,
					course_id: courseId,
					node_type: nodeType,
					node_id: nodeId,
					position_x: positionX,
					position_y: positionY
				},
				{
					onConflict: 'user_id,course_id,node_type,node_id'
				}
			)
			.select()
			.single()

		if (error) throw new Error(error.message)

		return data
	}

	static async resetPositions(userId: string, courseId: number) {
		const { error } = await supabase
			.from('roadmap_positions')
			.delete()
			.eq('user_id', userId)
			.eq('course_id', courseId)

		if (error) throw new Error(error.message)
		return { success: true }
	}
}
