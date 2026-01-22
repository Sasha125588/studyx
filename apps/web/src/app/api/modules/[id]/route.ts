import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const moduleIdParamsSchema = z.object({
  id: z.coerce.number(),
})

export const moduleResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const moduleErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type ModuleResponse = z.infer<typeof moduleResponseSchema>
export type ModuleError = z.infer<typeof moduleErrorSchema>

interface RouteParams {
  id: string
}

/**
 * Get module by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<ModuleError | ModuleResponse>> {
  try {
    const validationResult = moduleIdParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid module ID',
      }, { status: 400 })
    }

    const { id } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('id', id)
      .single()

    if (error?.code === 'PGRST116') {
      return NextResponse.json({
        success: false,
        error: 'Module not found',
      }, { status: 404 })
    }

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: 'Database error',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  }
  catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
