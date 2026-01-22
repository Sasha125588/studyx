import type { CourseWithDetails, LessonBlock } from '@studyx/types'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const courseSlugParamsSchema = z.object({
  slug: z.string(),
})

export interface GetCourseBySlugResponse {
  success: boolean
  data: CourseWithDetails
}

export interface CourseError {
  success: boolean
  error: string
  code?: string | undefined
}

interface RouteParams {
  slug: string
}

/**
 * Get course by slug
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<CourseError | GetCourseBySlugResponse>> {
  try {
    const validationResult = courseSlugParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid slug',
      }, { status: 400 })
    }

    const { slug } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('courses')
      .select(
        `
        *,
        modules (
          *,
          lessons (*)
        ),
        course_authors (
          user (*)
        ),
        course_skills (
          skills (*)
        )
      `,
      )
      .eq('slug', slug)
      .order('order_index', { referencedTable: 'modules', ascending: true })
      .order('order_index', { referencedTable: 'modules.lessons', ascending: true })
      .order('order_index', { referencedTable: 'course_skills', ascending: true })
      .single()

    if (error?.details === 'The result contains 0 rows') {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
      }, { status: 404 })
    }

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: 'Database error',
      }, { status: 500 })
    }

    const result = {
      ...data,
      authors: data.course_authors.map(ca => ca.user),
      skills: data.course_skills.map(cs => cs.skills),
      modules: (data.modules).map(m => ({
        ...m,
        lessons: (m.lessons).map(l => ({
          ...l,
          blocks: l.blocks as unknown as LessonBlock[],
        })),
      })),
    }

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
