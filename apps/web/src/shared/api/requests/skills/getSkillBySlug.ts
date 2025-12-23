import { api } from '@/lib/elysia/client'

export const getSkillBySlug = async (slug: string) => await api.skills.slug({ slug }).get()
