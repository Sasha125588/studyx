import type { Database, RoadmapNodeType } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

import { getUserId } from '@/shared/api/requests'

export class RoadmapPositionsService {
	constructor(private supabase: SupabaseClient<Database>) {}

	async getPositions(userId: string, courseId: number) {
		const { data, error } = await this.supabase
			.from('roadmap_positions')
			.select('*')
			.eq('user_id', userId ?? '')
			.eq('course_id', courseId)

		if (error) throw new Error(error.message)
		return data
	}

	async savePosition(
		userId: string,
		courseId: number,
		nodeType: RoadmapNodeType,
		nodeId: number,
		positionX: number,
		positionY: number
	) {
		const { data, error } = await this.supabase
			.from('roadmap_positions')
			.upsert(
				{
					user_id: userId ?? '',
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

	async resetPositions(courseId: number) {
		const userId = await getUserId()

		const { error } = await this.supabase
			.from('roadmap_positions')
			.delete()
			.eq('user_id', userId ?? '')
			.eq('course_id', courseId)

		if (error) throw new Error(error.message)
		return { success: true }
	}
}
