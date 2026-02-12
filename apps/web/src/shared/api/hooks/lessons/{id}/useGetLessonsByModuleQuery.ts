import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetLessonsByModuleParams } from '@/shared/api/requests/lessons/{id}/getLessonsByModule'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getLessonsByModule } from '@/shared/api/requests/lessons/{id}/getLessonsByModule'

export function useGetLessonsByModuleQuery(
  params: GetLessonsByModuleParams,
  options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lessons.byModule(params.id),
    queryFn: () => getLessonsByModule(params, createSupabaseClient()),
    ...options,
  })
}
