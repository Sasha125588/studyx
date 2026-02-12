import type { CourseWithDetails } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetCourseBySlugParams } from '@/shared/api/requests/courses/{slug}/getCourseBySlug'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getCourseBySlug } from '@/shared/api/requests/courses/{slug}/getCourseBySlug'

export function useGetCourseBySlugQuery(
  params: GetCourseBySlugParams,
  options?: Omit<UseQueryOptions<CourseWithDetails, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.courses.detail(params.slug),
    queryFn: () => getCourseBySlug(params, createSupabaseClient()),
    ...options,
  })
}
