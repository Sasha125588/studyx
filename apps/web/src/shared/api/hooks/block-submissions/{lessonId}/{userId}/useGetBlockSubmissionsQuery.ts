import type { BlockSubmission } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetBlockSubmissionsParams } from '@/shared/api/requests/block-submissions/{lessonId}/{userId}/getBlockSubmissions'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getBlockSubmissions } from '@/shared/api/requests/block-submissions/{lessonId}/{userId}/getBlockSubmissions'

export function useGetBlockSubmissionsQuery(
  params: GetBlockSubmissionsParams,
  options?: Omit<UseQueryOptions<BlockSubmission[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.blockSubmissions.byLesson(params.lessonId, params.userId),
    queryFn: () => getBlockSubmissions(params, createSupabaseClient()),
    ...options,
  })
}
