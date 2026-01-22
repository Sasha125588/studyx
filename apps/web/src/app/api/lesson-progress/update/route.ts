import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const lessonProgressUpdateBodySchema = z.object({
  lesson_id: z.number(),
  user_id: z.string(),
  completed: z.boolean(),
})

export const updateProgressResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export const updateProgressErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
  code: z.string().optional(),
})

export type UpdateProgressResponse = z.infer<typeof updateProgressResponseSchema>
export type UpdateProgressError = z.infer<typeof updateProgressErrorSchema>

/**
 * Update lesson progress
 */
export async function POST(request: NextRequest): Promise<NextResponse<UpdateProgressError | UpdateProgressResponse>> {
  try {
    const body = await request.json()
    const validationResult = lessonProgressUpdateBodySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
      }, { status: 400 })
    }

    const { lesson_id, user_id, completed } = validationResult.data
    const supabase = await createClient()

    // Check if progress record exists
    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('lesson_id', lesson_id)
      .eq('user_id', user_id)
      .single()

    const now = new Date().toISOString()

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('lesson_progress')
        .update({
          completed,
          completed_at: completed ? now : null,
        })
        .eq('id', existing.id)
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
    else {
      // Create new record
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          lesson_id,
          user_id,
          completed,
          started_at: now,
          completed_at: completed ? now : null,
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
  }
  catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
