import type { RoadmapPosition } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetRoadmapPositionsParams } from '@/shared/api/requests/roadmap-positions/getRoadmapPositions'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getRoadmapPositions } from '@/shared/api/requests/roadmap-positions/getRoadmapPositions'

export function useGetRoadmapPositionsQuery(
  params: GetRoadmapPositionsParams,
  options?: Omit<UseQueryOptions<RoadmapPosition[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.roadmapPositions.byUserAndCourse(params.userId, params.courseId),
    queryFn: () => getRoadmapPositions(params, createSupabaseClient()),
    ...options,
  })
}
