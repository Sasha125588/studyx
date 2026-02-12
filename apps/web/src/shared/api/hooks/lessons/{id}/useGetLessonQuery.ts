import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetLessonParams } from '@/shared/api/requests/lessons/{id}/getLesson'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getLesson } from '@/shared/api/requests/lessons/{id}/getLesson'

export function useGetLessonQuery(
  params: GetLessonParams,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lessons.byId(params.id),
    queryFn: () => getLesson(params, createSupabaseClient()),
    ...options,
  })
}
