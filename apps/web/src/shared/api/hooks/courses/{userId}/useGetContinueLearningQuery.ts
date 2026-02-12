import type { ContinueLearningCourse } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetContinueLearningParams } from '@/shared/api/requests/courses/{userId}/getContinueLearning'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getContinueLearning } from '@/shared/api/requests/courses/{userId}/getContinueLearning'

export function useGetContinueLearningQuery(
  params: GetContinueLearningParams,
  options?: Omit<UseQueryOptions<ContinueLearningCourse[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.courses.continueLearning(params.userId),
    queryFn: () => getContinueLearning(params, createSupabaseClient()),
    ...options,
  })
}
