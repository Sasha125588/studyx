import type { UseMutationOptions } from '@tanstack/react-query'
import type { UpdateLessonProgressParams } from '@/shared/api/requests/lesson-progress/updateLessonProgress'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { updateLessonProgress } from '@/shared/api/requests/lesson-progress/updateLessonProgress'

export function useUpdateLessonProgressMutation(
  options?: Omit<UseMutationOptions<any, Error, UpdateLessonProgressParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: params => updateLessonProgress(params, createSupabaseClient()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonProgress.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all })
    },
    ...options,
  })
}
