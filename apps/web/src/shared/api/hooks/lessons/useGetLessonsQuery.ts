import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getLessons } from '@/shared/api/requests/lessons/getLessons'

export function useGetLessonsQuery(
  options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lessons.all,
    queryFn: () => getLessons(createSupabaseClient()),
    ...options,
  })
}
