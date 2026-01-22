import type { CourseEnrollment } from '@studyx/types'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const enrollmentUserIdParamsSchema = z.object({
  userId: z.string(),
})

export interface UserEnrollmentsResponse {
  success: boolean
  data: CourseEnrollment[]
}

export interface UserEnrollmentsError {
  success: boolean
  error: string
  code?: string | undefined
}

interface RouteParams {
  userId: string
}

/**
 * Get user enrollments
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<UserEnrollmentsError | UserEnrollmentsResponse>> {
  try {
    const validationResult = enrollmentUserIdParamsSchema.safeParse(await params)

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
        *,
        courses (
          *,
          authors:course_authors (
            *,
            user (*)
          )
        )
      `,
      )
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false })

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
