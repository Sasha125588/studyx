import type { CourseEnrollment } from '@studyx/types'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { BadRequestError, InternalServerError, NotFoundError } from '@/shared/api/errors'

const enrollmentStatusParamsSchema = z.object({
  courseId: z.string(),
  userId: z.string(),
})

export interface EnrollmentStatusResponse {
  success: boolean
  data: CourseEnrollment
}

export interface EnrollmentStatusError {
  success: boolean
  error: string
  code?: string | undefined
}

interface RouteParams {
  courseId: string
  userId: string
}

/**
 * Get enrollment status
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<EnrollmentStatusError | EnrollmentStatusResponse>> {
  try {
    const validationResult = enrollmentStatusParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return new BadRequestError('Invalid parameters').toResponse()
    }

    const { courseId, userId } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('course_id', Number.parseInt(courseId))
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error)
      return new InternalServerError('Database error').toResponse()
    }

    if (!data) {
      return new NotFoundError('Enrollment not found').toResponse()
    }

    return NextResponse.json({
      success: true,
      data,
    })
  }
  catch (error) {
    console.error('Internal server error:', error)
    return new InternalServerError('Internal server error').toResponse()
  }
}
