import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetModuleParams {
  id: number
}

export interface GetModuleResponse {
  success: boolean
  data: any
}

export interface GetModuleError {
  success: boolean
  error: string
  code?: string
}

export async function getModule(params: GetModuleParams, supabase: SupabaseClient<Database>): Promise<any> {
  const { id } = params

  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') {
    throw new Error('Module not found')
  }

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  return data
}
