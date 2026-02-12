import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface UpdateLessonProgressParams {
  lesson_id: number
  user_id: string
  completed: boolean
}

export interface UpdateLessonProgressResponse {
  success: boolean
  data: any
}

export interface UpdateLessonProgressError {
  success: boolean
  error: string
  code?: string
}

export async function updateLessonProgress(params: UpdateLessonProgressParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { lesson_id, user_id, completed } = params

  // Check if progress record exists
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('lesson_id', lesson_id)
    .eq('user_id', user_id)
    .single()

  const now = new Date().toISOString()

  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('lesson_progress')
      .update({
        completed,
        completed_at: completed ? now : null,
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Database error')
    }

    return data
  }
  else {
    // Create new record
    const { data, error } = await supabase
      .from('lesson_progress')
      .insert({
        lesson_id,
        user_id,
        completed,
        started_at: now,
        completed_at: completed ? now : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Database error')
    }

    return data
  }
}
