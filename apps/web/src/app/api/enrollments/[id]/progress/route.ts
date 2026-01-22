import type { EnrollmentStatus } from '@studyx/types'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const enrollmentIdParamsSchema = z.object({
  id: z.coerce.number(),
})

const enrollmentProgressBodySchema = z.object({
  progress: z.number().min(0).max(100),
})

export const progressResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const progressErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type ProgressResponse = z.infer<typeof progressResponseSchema>
export type ProgressError = z.infer<typeof progressErrorSchema>

interface RouteParams {
  id: string
}

/**
 * Update enrollment progress
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<ProgressError | ProgressResponse>> {
  try {
    const paramsValidation = enrollmentIdParamsSchema.safeParse(await params)
    if (!paramsValidation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid enrollment ID',
      }, { status: 400 })
    }

    const body = await request.json()
    const bodyValidation = enrollmentProgressBodySchema.safeParse(body)
    if (!bodyValidation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid progress value',
      }, { status: 400 })
    }

    const { id } = paramsValidation.data
    const { progress } = bodyValidation.data
    const supabase = await createClient()

    const updateData: {
      progress: number
      status?: EnrollmentStatus
      completed_at?: string
    } = { progress }

    if (progress >= 100) {
      updateData.status = 'completed'
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .update(updateData)
      .eq('id', id)
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
