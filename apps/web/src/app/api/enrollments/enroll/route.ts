import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

export const enrollmentBodySchema = z.object({
  course_id: z.number().describe('Course ID'),
  user_id: z.string().describe('User ID'),
}).describe('Enrollment body')

export const enrollResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const enrollErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type EnrollResponse = z.infer<typeof enrollResponseSchema>
export type EnrollError = z.infer<typeof enrollErrorSchema>

/**
 * Enroll user in course
 */
export async function POST(request: NextRequest): Promise<NextResponse<EnrollError | EnrollResponse>> {
  try {
    const body = await request.json()
    const validationResult = enrollmentBodySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
      }, { status: 400 })
    }

    const { course_id, user_id } = validationResult.data
    const supabase = await createClient()

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', course_id)
      .eq('user_id', user_id)
      .single()

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'User is already enrolled in this course',
      }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        course_id,
        user_id,
        status: 'enrolled',
        progress: 0,
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single()

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
