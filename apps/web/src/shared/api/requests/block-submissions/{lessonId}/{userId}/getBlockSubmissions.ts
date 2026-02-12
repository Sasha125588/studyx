import type { BlockSubmission, BlockSubmissionContent, Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetBlockSubmissionsParams {
  lessonId: number
  userId: string
}

export interface GetBlockSubmissionsResponse {
  success: boolean
  data: BlockSubmission[]
}

export interface GetBlockSubmissionsError {
  success: boolean
  error: string
  code?: string
}

export async function getBlockSubmissions(params: GetBlockSubmissionsParams, supabase: SupabaseClient<Database>): Promise<BlockSubmission[]> {
  const { lessonId, userId } = params

  const { data, error } = await supabase
    .from('block_submissions')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('user_id', userId)

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
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

  return result
}
