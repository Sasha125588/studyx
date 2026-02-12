import type { Database, EnrollmentStatus } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface UpdateEnrollmentProgressParams {
  id: number
  progress: number
}

export interface UpdateEnrollmentProgressResponse {
  success: boolean
  data: any
}

export interface UpdateEnrollmentProgressError {
  success: boolean
  error: string
  code?: string
}

export async function updateEnrollmentProgress(params: UpdateEnrollmentProgressParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { id, progress } = params

  const updateData: {
    progress: number
    status?: EnrollmentStatus
    completed_at?: string
  } = { progress }

  if (progress >= 100) {
    updateData.status = 'completed'
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('course_enrollments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
