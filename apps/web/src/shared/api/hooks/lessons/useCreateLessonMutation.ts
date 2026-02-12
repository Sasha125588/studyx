import type { UseMutationOptions } from '@tanstack/react-query'
import type { CreateLessonParams } from '@/shared/api/requests/lessons/createLesson'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { createLesson } from '@/shared/api/requests/lessons/createLesson'

export function useCreateLessonMutation(
  options?: Omit<UseMutationOptions<any, Error, CreateLessonParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: params => createLesson(params, createSupabaseClient()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all })
    },
    ...options,
  })
}
