'use server'

import { api } from '@/lib/elysia/client'

export const getCourse = async (slug: string) => await api.courses.slug({ slug }).get()
