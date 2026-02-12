import type { UseMutationOptions } from '@tanstack/react-query'
import type { DeleteLessonParams } from '@/shared/api/requests/lessons/{id}/deleteLesson'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { deleteLesson } from '@/shared/api/requests/lessons/{id}/deleteLesson'

export function useDeleteLessonMutation(
  options?: Omit<UseMutationOptions<{ message: string }, Error, DeleteLessonParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: params => deleteLesson(params, createSupabaseClient()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all })
    },
    ...options,
  })
}
