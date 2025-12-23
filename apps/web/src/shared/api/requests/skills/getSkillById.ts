import { api } from '@/lib/elysia/client'

export const getSkillById = async (id: number) => await api.skills({ id }).get()
