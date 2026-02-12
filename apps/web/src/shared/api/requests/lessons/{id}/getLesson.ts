import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetLessonParams {
  id: number
}

export interface GetLessonResponse {
  success: boolean
  data: any
}

export interface GetLessonError {
  success: boolean
  error: string
  code?: string
}

export async function getLesson(params: GetLessonParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { id } = params

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') {
    throw new Error('Lesson not found')
  }

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
