import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const lessonIdParamsSchema = z.object({
  id: z.coerce.number(),
})

export const moduleLessonsResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const moduleLessonsErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type ModuleLessonsResponse = z.infer<typeof moduleLessonsResponseSchema>
export type ModuleLessonsError = z.infer<typeof moduleLessonsErrorSchema>

interface RouteParams {
  id: string
}

/**
 * Get lessons by module ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<ModuleLessonsError | ModuleLessonsResponse>> {
  try {
    const validationResult = lessonIdParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid module ID',
      }, { status: 400 })
    }

    const { id } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', id)
      .order('order_index', { ascending: true })

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
