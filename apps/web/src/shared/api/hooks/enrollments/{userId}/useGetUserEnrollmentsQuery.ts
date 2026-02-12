import type { CourseEnrollment } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetUserEnrollmentsParams } from '@/shared/api/requests/enrollments/{userId}/getUserEnrollments'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getUserEnrollments } from '@/shared/api/requests/enrollments/{userId}/getUserEnrollments'

export function useGetUserEnrollmentsQuery(
  params: GetUserEnrollmentsParams,
  options?: Omit<UseQueryOptions<CourseEnrollment[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.enrollments.user(params.userId),
    queryFn: () => getUserEnrollments(params, createSupabaseClient()),
    ...options,
  })
}
