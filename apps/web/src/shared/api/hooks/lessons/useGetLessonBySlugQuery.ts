import type { LessonFullContext } from '@studyx/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetLessonBySlugParams } from '@/shared/api/requests/lessons/getLessonBySlug'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getLessonBySlug } from '@/shared/api/requests/lessons/getLessonBySlug'

export function useGetLessonBySlugQuery(
  params: GetLessonBySlugParams,
  options?: Omit<UseQueryOptions<LessonFullContext, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lessons.bySlug(params.courseSlug, params.lessonSlug),
    queryFn: () => getLessonBySlug(params, createSupabaseClient()),
    ...options,
  })
}
