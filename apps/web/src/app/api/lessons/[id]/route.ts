import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const lessonIdParamsSchema = z.object({
  id: z.coerce.number(),
})

const lessonUpdateBodySchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  type: z.enum(['lecture', 'practical', 'test']).optional(),
  moduleId: z.number().optional(),
  blocks: z.array(z.any()).optional(),
  orderIndex: z.number().optional(),
})

export const lessonResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const lessonErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type LessonResponse = z.infer<typeof lessonResponseSchema>
export type LessonError = z.infer<typeof lessonErrorSchema>

interface RouteParams {
  id: string
}

/**
 * Get lesson by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<LessonError | LessonResponse>> {
  try {
    const validationResult = lessonIdParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson ID',
      }, { status: 400 })
    }

    const { id } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()

    if (error?.code === 'PGRST116') {
      return NextResponse.json({
        success: false,
        error: 'Lesson not found',
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

/**
 * Update lesson
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<LessonError | LessonResponse>> {
  try {
    const paramsValidation = lessonIdParamsSchema.safeParse(await params)
    if (!paramsValidation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson ID',
      }, { status: 400 })
    }

    const body = await request.json()
    const bodyValidation = lessonUpdateBodySchema.safeParse(body)
    if (!bodyValidation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
      }, { status: 400 })
    }

    const { id } = paramsValidation.data
    const updateData = bodyValidation.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error?.code === 'PGRST116') {
      return NextResponse.json({
        success: false,
        error: 'Lesson not found',
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

/**
 * Delete lesson
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<LessonError | LessonResponse>> {
  try {
    const validationResult = lessonIdParamsSchema.safeParse(await params)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson ID',
      }, { status: 400 })
    }

    const { id } = validationResult.data
    const supabase = await createClient()

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: 'Database error',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Lesson deleted successfully' },
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
