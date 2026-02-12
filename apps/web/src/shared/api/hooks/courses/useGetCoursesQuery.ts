import type { CourseWithDetails } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetCoursesParams } from '@/shared/api/requests/courses/getCourses'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getCourses } from '@/shared/api/requests/courses/getCourses'

export function useGetCoursesQuery(
  params: GetCoursesParams,
  options?: Omit<UseQueryOptions<CourseWithDetails[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.courses.list(params),
    queryFn: () => getCourses(params, createSupabaseClient()),
    ...options,
  })
}
