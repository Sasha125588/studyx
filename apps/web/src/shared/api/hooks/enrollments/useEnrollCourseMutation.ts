import type { UseMutationOptions } from '@tanstack/react-query'
import type { EnrollCourseParams } from '@/shared/api/requests/enrollments/enrollCourse'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { enrollCourse } from '@/shared/api/requests/enrollments/enrollCourse'

export function useEnrollCourseMutation(
  options?: Omit<UseMutationOptions<any, Error, EnrollCourseParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: params => enrollCourse(params, createSupabaseClient()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all })
    },
    ...options,
  })
}
