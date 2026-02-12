import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetCourseProgressParams {
  courseId: string
  userId: string
}

export interface GetCourseProgressResponse {
  success: boolean
  data: any
}

export interface GetCourseProgressError {
  success: boolean
  error: string
  code?: string
}

export async function getCourseProgress(params: GetCourseProgressParams, supabase: SupabaseClient<Database>): Promise<any[]> {
  const { courseId, userId } = params

  const { data, error } = await supabase
    .from('lesson_progress')
    .select(
      `
        *,
        lessons (
          id,
          title,
          type,
          order_index,
          modules (
            id,
            name,
            order_index
          )
        )
      `,
    )
    .eq('user_id', userId)
    .eq('lessons.modules.course_id', Number.parseInt(courseId))
    .order('lessons.modules.order_index', { ascending: true })
    .order('lessons.order_index', { ascending: true })

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
