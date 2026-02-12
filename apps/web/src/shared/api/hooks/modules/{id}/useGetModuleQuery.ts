import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetModuleParams } from '@/shared/api/requests/modules/{id}/getModule'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getModule } from '@/shared/api/requests/modules/{id}/getModule'

export function useGetModuleQuery(
  params: GetModuleParams,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.modules.byId(params.id),
    queryFn: () => getModule(params, createSupabaseClient()),
    ...options,
  })
}
