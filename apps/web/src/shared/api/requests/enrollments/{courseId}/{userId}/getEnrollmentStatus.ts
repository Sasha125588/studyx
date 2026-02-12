import type { CourseEnrollment, Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetEnrollmentStatusParams {
  courseId: string
  userId: string
}

export interface GetEnrollmentStatusResponse {
  success: boolean
  data: CourseEnrollment
}

export interface GetEnrollmentStatusError {
  success: boolean
  error: string
  code?: string
}

export async function getEnrollmentStatus(params: GetEnrollmentStatusParams, supabase: SupabaseClient<Database>): Promise<CourseEnrollment> {
  const { courseId, userId } = params

  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('course_id', Number.parseInt(courseId))
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  if (!data) {
    throw new Error('Enrollment not found')
  }

  return data
}
