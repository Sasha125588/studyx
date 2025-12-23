import { api } from '@/lib/elysia/client'

export const getModuleById = async (moduleId: number) => await api.modules({ id: moduleId }).get()
