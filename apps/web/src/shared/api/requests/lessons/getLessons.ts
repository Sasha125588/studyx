import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetLessonsResponse {
  success: boolean
  data: any
}

export interface GetLessonsError {
  success: boolean
  error: string
  code?: string
}

export async function getLessons(supabase: SupabaseClient<Database>): Promise<any[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
