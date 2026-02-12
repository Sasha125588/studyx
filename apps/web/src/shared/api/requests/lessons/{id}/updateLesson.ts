import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface UpdateLessonParams {
  id: number
  title?: string
  slug?: string
  type?: 'lecture' | 'practical' | 'test'
  moduleId?: number
  blocks?: any[]
  orderIndex?: number
}

export interface UpdateLessonResponse {
  success: boolean
  data: any
}

export interface UpdateLessonError {
  success: boolean
  error: string
  code?: string
}

export async function updateLesson(params: UpdateLessonParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { id, ...updateData } = params

  const { data, error } = await supabase
    .from('lessons')
    .update(updateData)
    .eq('id', id)
    .select()
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
