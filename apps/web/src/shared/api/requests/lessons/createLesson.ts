import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface CreateLessonParams {
  title: string
  slug: string
  type: 'lecture' | 'practical' | 'test'
  moduleId: number
  blocks: any[]
  orderIndex?: number
}

export interface CreateLessonResponse {
  success: boolean
  data: any
}

export interface CreateLessonError {
  success: boolean
  error: string
  code?: string
}

export async function createLesson(params: CreateLessonParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { title, slug, type, moduleId, blocks, orderIndex } = params

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      title,
      slug,
      type,
      module_id: moduleId,
      blocks,
      order_index: orderIndex,
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
