'use server'

import { api } from '@/lib/elysia/client'

export const getCoursesWithDetails = async () => await api.courses['with-details'].get()
