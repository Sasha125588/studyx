import { api } from '@/lib/elysia/client'

export const getAllSkills = async () => await api.skills.get()
