import type { UseMutationOptions } from '@tanstack/react-query'
import type { UpdateEnrollmentProgressParams } from '@/shared/api/requests/enrollments/{id}/updateEnrollmentProgress'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { updateEnrollmentProgress } from '@/shared/api/requests/enrollments/{id}/updateEnrollmentProgress'

export function useUpdateEnrollmentProgressMutation(
  options?: Omit<UseMutationOptions<any, Error, UpdateEnrollmentProgressParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: params => updateEnrollmentProgress(params, createSupabaseClient()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all })
    },
    ...options,
  })
}
