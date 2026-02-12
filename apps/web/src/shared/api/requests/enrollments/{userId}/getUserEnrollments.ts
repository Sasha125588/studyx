import type { CourseEnrollment, Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetUserEnrollmentsParams {
  userId: string
}

export interface GetUserEnrollmentsResponse {
  success: boolean
  data: CourseEnrollment[]
}

export interface GetUserEnrollmentsError {
  success: boolean
  error: string
  code?: string
}

export async function getUserEnrollments(params: GetUserEnrollmentsParams, supabase: SupabaseClient<Database>): Promise<CourseEnrollment[]> {
  const { userId } = params

  const { data, error } = await supabase
    .from('course_enrollments')
    .select(
      `
        *,
        courses (
          *,
          authors:course_authors (
            *,
            user (*)
          )
        )
      `,
    )
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
