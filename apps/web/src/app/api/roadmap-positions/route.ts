import type { RoadmapPosition } from '@studyx/types'
import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { InternalServerError } from '@/shared/api'

const getQuerySchema = z.object({
  userId: z.string().optional(),
  courseId: z.string().optional(),
})

const saveBodySchema = z.object({
  userId: z.string(),
  courseId: z.number(),
  nodeType: z.string(),
  nodeId: z.number(),
  positionX: z.number(),
  positionY: z.number(),
})

export interface GetRoadmapPositionsResponse {
  success: boolean
  data: RoadmapPosition[]
}

export interface RoadmapPositionsError {
  success: boolean
  error: string
  code?: string | undefined
}

/**
 * Get roadmap positions
 */
export async function GET(request: NextRequest): Promise<NextResponse<RoadmapPositionsError | GetRoadmapPositionsResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = Object.fromEntries(searchParams.entries())
    const validationResult = getQuerySchema.safeParse(queryParams)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
      }, { status: 400 })
    }

    const { userId, courseId } = validationResult.data
    const supabase = await createClient()

    let query = supabase.from('roadmap_positions').select('*')

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (courseId) {
      query = query.eq('course_id', Number.parseInt(courseId))
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return new InternalServerError('Database error').toResponse()
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

export interface SaveRoadmapPositionsResponse {
  success: boolean
}

/**
 * Save roadmap position
 */
export async function POST(request: NextRequest): Promise<NextResponse<RoadmapPositionsError | SaveRoadmapPositionsResponse>> {
  try {
    const body = await request.json()
    const validationResult = saveBodySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
      }, { status: 400 })
    }

    const { userId, courseId, nodeType, nodeId, positionX, positionY } = validationResult.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('roadmap_positions')
      .upsert({
        user_id: userId,
        course_id: courseId,
        node_type: nodeType,
        node_id: +nodeId,
        position_x: positionX,
        position_y: positionY,
      }, {
        onConflict: 'user_id,course_id,node_type,node_id',
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
