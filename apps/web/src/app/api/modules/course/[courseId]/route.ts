import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const moduleCourseIdParamsSchema = z.object({
  courseId: z.coerce.number(),
})

export const courseModulesResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const courseModulesErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type CourseModulesResponse = z.infer<typeof courseModulesResponseSchema>
export type CourseModulesError = z.infer<typeof courseModulesErrorSchema>

interface RouteParams {
  courseId: string
}

/**
 * Get modules by course ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<CourseModulesError | CourseModulesResponse>> {
  try {
    const validationResult = moduleCourseIdParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid course ID',
      }, { status: 400 })
    }

    const { courseId } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
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
