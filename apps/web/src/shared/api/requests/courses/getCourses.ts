import { api } from '@/lib/elysia/client'

export const getCourses = async () => await api.courses.get()
