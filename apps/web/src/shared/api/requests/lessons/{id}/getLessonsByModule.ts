import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetLessonsByModuleParams {
  id: number
}

export interface GetLessonsByModuleResponse {
  success: boolean
  data: any
}

export interface GetLessonsByModuleError {
  success: boolean
  error: string
  code?: string
}

export async function getLessonsByModule(params: GetLessonsByModuleParams, supabase: SupabaseClient<Database>): Promise<any[]> {
  const { id } = params

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', id)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
