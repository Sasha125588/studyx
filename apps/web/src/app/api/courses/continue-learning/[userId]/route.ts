import type { ContinueLearningCourse } from '@studyx/types'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const courseUserIdParamsSchema = z.object({
  userId: z.string(),
})

export interface ContinueLearningResponse {
  success: boolean
  data: ContinueLearningCourse[]
}

export interface ContinueLearningError {
  success: boolean
  error: string
  code?: string | undefined
}

interface RouteParams {
  userId: string
}

/**
 * Get continue learning courses for a user
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<ContinueLearningError | ContinueLearningResponse>> {
  try {
    const validationResult = courseUserIdParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID',
      }, { status: 400 })
    }

    const { userId } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('course_enrollments')
      .select(
        `
        progress,
        status,
        courses (
          id,
          title,
          slug,
          description,
          modules (
            id,
            name,
            lessons (
              id,
              title,
              order_index,
              lesson_progress (
                completed
              )
            )
          )
        )
        `,
      )
      .eq('user_id', userId)
      .in('status', ['enrolled', 'in_progress'])
      .order('order_index', { referencedTable: 'courses.modules', ascending: true })
      .order('enrolled_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: 'Database error',
      }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const result = data.map((enrollment) => {
      const course = enrollment.courses!
      let nextLesson = null

      for (const module_ of course.modules) {
        const sortedLessons = module_.lessons.sort(
          (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
        )

        for (let i = 0; i < sortedLessons.length; i++) {
          const lesson = sortedLessons[i]
          const isCompleted = lesson.lesson_progress?.[0]?.completed

          if (!isCompleted) {
            nextLesson = {
              id: lesson.id,
              title: lesson.title,
              moduleName: module_.name,
              number: i + 1,
              totalLessons: module_.lessons.length,
            }
            break
          }
        }

        if (nextLesson)
          break
      }

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course?.description,
        progress: enrollment.progress ?? 0,
        status: enrollment.status,
        nextLesson,
      }
    })

    return NextResponse.json({
      success: true,
      data: result,
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
