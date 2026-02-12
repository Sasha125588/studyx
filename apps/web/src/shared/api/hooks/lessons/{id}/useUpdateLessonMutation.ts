import type { UseMutationOptions } from '@tanstack/react-query'
import type { UpdateLessonParams } from '@/shared/api/requests/lessons/{id}/updateLesson'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { updateLesson } from '@/shared/api/requests/lessons/{id}/updateLesson'

export function useUpdateLessonMutation(
  options?: Omit<UseMutationOptions<any, Error, UpdateLessonParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: params => updateLesson(params, createSupabaseClient()),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.byId(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all })
    },
    ...options,
  })
}
