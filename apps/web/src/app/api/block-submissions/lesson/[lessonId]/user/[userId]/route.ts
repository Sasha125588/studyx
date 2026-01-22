import type { BlockSubmission, BlockSubmissionContent } from '@studyx/types'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { BadRequestError, InternalServerError } from '@/shared/api/errors'

const routeParamsSchema = z.object({
  lessonId: z.coerce.number(),
  userId: z.string(),
})

export interface BlockSubmissionsResponse {
  success: boolean
  data: BlockSubmission[]
}

export interface BlockSubmissionsError {
  success: boolean
  error: string
  code?: string
}

interface RouteParams {
  lessonId: string
  userId: string
}

/**
 * Get user block submissions for a lesson
 */
export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse<BlockSubmissionsError | BlockSubmissionsResponse>> {
  try {
    const paramsValidation = routeParamsSchema.safeParse(await params)
    if (!paramsValidation.success) {
      return new BadRequestError('Invalid parameters').toResponse()
    }

    const { lessonId, userId } = paramsValidation.data
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('block_submissions')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', userId)

    if (error) {
      console.error('Database error:', error)
      return new InternalServerError('Database error').toResponse()
    }

    const result = data?.map(submission => ({
      id: submission.id,
      userId: submission.user_id,
      lessonId: submission.lesson_id,
      blockId: submission.block_id,
      submissionType: submission.submission_type,
      content: submission.content as unknown as BlockSubmissionContent,
      maxScore: submission.max_score,
      score: submission.score,
      feedback: submission.feedback,
      gradedBy: submission.graded_by,
      createdAt: submission.created_at,
      updatedAt: submission.updated_at,
      gradedAt: submission.graded_at,
    })) || []

    return NextResponse.json({
      success: true,
      data: result,
    })
  }
  catch (error) {
    console.error('Internal server error:', error)
    return new InternalServerError('Internal server error').toResponse()
  }
}
