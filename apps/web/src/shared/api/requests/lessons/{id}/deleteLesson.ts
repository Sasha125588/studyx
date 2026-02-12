import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface DeleteLessonParams {
  id: number
}

export interface DeleteLessonResponse {
  success: boolean
  data: { message: string }
}

export interface DeleteLessonError {
  success: boolean
  error: string
  code?: string
}

export async function deleteLesson(params: DeleteLessonParams, supabase: SupabaseClient<Database>): Promise<{ message: string }> {
  const { id } = params

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return { message: 'Lesson deleted successfully' }
}
