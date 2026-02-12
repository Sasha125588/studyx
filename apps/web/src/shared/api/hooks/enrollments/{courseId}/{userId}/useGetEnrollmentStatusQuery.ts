import type { CourseEnrollment } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetEnrollmentStatusParams } from '@/shared/api/requests/enrollments/{courseId}/{userId}/getEnrollmentStatus'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getEnrollmentStatus } from '@/shared/api/requests/enrollments/{courseId}/{userId}/getEnrollmentStatus'

export function useGetEnrollmentStatusQuery(
  params: GetEnrollmentStatusParams,
  options?: Omit<UseQueryOptions<CourseEnrollment, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.enrollments.status(params.courseId, params.userId),
    queryFn: () => getEnrollmentStatus(params, createSupabaseClient()),
    ...options,
  })
}
