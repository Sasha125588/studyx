import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetCourseProgressParams } from '@/shared/api/requests/lesson-progress/{courseId}/{userId}/getCourseProgress'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getCourseProgress } from '@/shared/api/requests/lesson-progress/{courseId}/{userId}/getCourseProgress'

export function useGetCourseProgressQuery(
  params: GetCourseProgressParams,
  options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lessonProgress.course(params.courseId, params.userId),
    queryFn: () => getCourseProgress(params, createSupabaseClient()),
    ...options,
  })
}
