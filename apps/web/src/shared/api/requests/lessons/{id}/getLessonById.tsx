import { api } from '@/lib/elysia/client'

export const getLessonById = async (id: number) => await api.lessons({ id: id }).get()
