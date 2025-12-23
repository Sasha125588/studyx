import { supabase } from '../../lib/supabase'

export type NodePosition = {
	nodeType: 'module' | 'lesson'
	nodeId: number
	positionX: number
	positionY: number
}

export abstract class RoadmapPositionsService {
	/**
	 * Get all roadmap positions for a user and course
	 */
	static async getPositions(userId: string, courseId: number) {
		const { data, error } = await supabase
			.from('roadmap_positions')
			.select('*')
			.eq('user_id', userId)
			.eq('course_id', courseId)

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Save or update multiple positions at once (upsert)
	 */
	static async savePositions(userId: string, courseId: number, positions: NodePosition[]) {
		const records = positions.map(pos => ({
			user_id: userId,
			course_id: courseId,
			node_type: pos.nodeType,
			node_id: pos.nodeId,
			position_x: pos.positionX,
			position_y: pos.positionY
		}))

		const { data, error } = await supabase
			.from('roadmap_positions')
			.upsert(records, {
				onConflict: 'user_id,course_id,node_type,node_id'
			})
			.select()

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Save or update a single position
	 */
	static async savePosition(
		userId: string,
		courseId: number,
		nodeType: 'module' | 'lesson',
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

	/**
	 * Delete all positions for a user and course (reset to default)
	 */
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
