import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface SaveRoadmapPositionParams {
  userId: string
  courseId: number
  nodeType: string
  nodeId: number
  positionX: number
  positionY: number
}

export interface SaveRoadmapPositionResponse {
  success: boolean
  data: any
}

export interface SaveRoadmapPositionError {
  success: boolean
  error: string
  code?: string
}

export async function saveRoadmapPosition(params: SaveRoadmapPositionParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { userId, courseId, nodeType, nodeId, positionX, positionY } = params

  const { data, error } = await supabase
    .from('roadmap_positions')
    .upsert({
      user_id: userId,
      course_id: courseId,
      node_type: nodeType,
      node_id: +nodeId,
      position_x: positionX,
      position_y: positionY,
    }, {
      onConflict: 'user_id,course_id,node_type,node_id',
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
