import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetModulesByCourseParams } from '@/shared/api/requests/modules/{courseId}/getModulesByCourse'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getModulesByCourse } from '@/shared/api/requests/modules/{courseId}/getModulesByCourse'

export function useGetModulesByCourseQuery(
  params: GetModulesByCourseParams,
  options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.modules.byCourse(params.courseId),
    queryFn: () => getModulesByCourse(params, createSupabaseClient()),
    ...options,
  })
}
