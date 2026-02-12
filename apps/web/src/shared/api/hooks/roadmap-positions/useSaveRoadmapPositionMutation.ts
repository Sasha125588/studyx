import type { UseMutationOptions } from '@tanstack/react-query'
import type { SaveRoadmapPositionParams } from '@/shared/api/requests/roadmap-positions/saveRoadmapPosition'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { saveRoadmapPosition } from '@/shared/api/requests/roadmap-positions/saveRoadmapPosition'

export function useSaveRoadmapPositionMutation(
  options?: Omit<UseMutationOptions<any, Error, SaveRoadmapPositionParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: params => saveRoadmapPosition(params, createSupabaseClient()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmapPositions.all })
    },
    ...options,
  })
}
