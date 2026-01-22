import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const lessonCreateBodySchema = z.object({
  title: z.string(),
  slug: z.string(),
  type: z.enum(['lecture', 'practical', 'test']),
  moduleId: z.number(),
  blocks: z.array(z.any()),
  orderIndex: z.number().optional(),
})

export const lessonsResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const lessonsErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type LessonsResponse = z.infer<typeof lessonsResponseSchema>
export type LessonsError = z.infer<typeof lessonsErrorSchema>

/**
 * Get all lessons
 */
export async function GET(_request: NextRequest): Promise<NextResponse<LessonsError | LessonsResponse>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
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

/**
 * Create a new lesson
 */
export async function POST(request: NextRequest): Promise<NextResponse<LessonsError | LessonsResponse>> {
  try {
    const body = await request.json()
    const validationResult = lessonCreateBodySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
      }, { status: 400 })
    }

    const { title, slug, type, moduleId, blocks, orderIndex } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        title,
        slug,
        type,
        module_id: moduleId,
        blocks,
        order_index: orderIndex,
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
    }, { status: 201 })
  }
  catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
