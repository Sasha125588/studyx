import type { Database, RoadmapPosition } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetRoadmapPositionsParams {
  userId: string
  courseId: string
}

export interface GetRoadmapPositionsResponse {
  success: boolean
  data: RoadmapPosition[]
}

export interface GetRoadmapPositionsError {
  success: boolean
  error: string
  code?: string
}

export async function getRoadmapPositions(params: GetRoadmapPositionsParams, supabase: SupabaseClient<Database>): Promise<RoadmapPosition[]> {
  const { userId, courseId } = params

  let query = supabase.from('roadmap_positions').select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  if (courseId) {
    query = query.eq('course_id', Number.parseInt(courseId))
  }

  const { data, error } = await query

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
