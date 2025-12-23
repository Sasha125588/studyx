import { api } from '@/lib/elysia/client'

export const getLessonById = async (lessonId: number) => await api.lessons({ id: lessonId }).get()
