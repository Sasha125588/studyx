import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const lessonProgressCourseParamsSchema = z.object({
  courseId: z.string(),
  userId: z.string(),
})

export const courseProgressResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const courseProgressErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type CourseProgressResponse = z.infer<typeof courseProgressResponseSchema>
export type CourseProgressError = z.infer<typeof courseProgressErrorSchema>

interface RouteParams {
  courseId: string
  userId: string
}

/**
 * Get course progress for user
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<CourseProgressError | CourseProgressResponse>> {
  try {
    const validationResult = lessonProgressCourseParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid parameters',
      }, { status: 400 })
    }

    const { courseId, userId } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('lesson_progress')
      .select(
        `
        *,
        lessons (
          id,
          title,
          type,
          order_index,
          modules (
            id,
            name,
            order_index
          )
        )
      `,
      )
      .eq('user_id', userId)
      .eq('lessons.modules.course_id', Number.parseInt(courseId))
      .order('lessons.modules.order_index', { ascending: true })
      .order('lessons.order_index', { ascending: true })

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
