import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetModulesByCourseParams {
  courseId: number
}

export interface GetModulesByCourseResponse {
  success: boolean
  data: any
}

export interface GetModulesByCourseError {
  success: boolean
  error: string
  code?: string
}

export async function getModulesByCourse(params: GetModulesByCourseParams, supabase: SupabaseClient<Database>): Promise<any[]> {
  const { courseId } = params

  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
