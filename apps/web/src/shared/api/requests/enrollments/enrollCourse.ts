import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface EnrollCourseParams {
  course_id: number
  user_id: string
}

export interface EnrollCourseResponse {
  success: boolean
  data: any
}

export interface EnrollCourseError {
  success: boolean
  error: string
  code?: string
}

export async function enrollCourse(params: EnrollCourseParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { course_id, user_id } = params

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', course_id)
    .eq('user_id', user_id)
    .single()

  if (existing) {
    throw new Error('User is already enrolled in this course')
  }

  const { data, error } = await supabase
    .from('course_enrollments')
    .insert({
      course_id,
      user_id,
      status: 'enrolled',
      progress: 0,
      enrolled_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
