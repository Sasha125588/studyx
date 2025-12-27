'use server'

import { api } from '@/lib/elysia/client'

export const getLessonBySlug = async (courseSlug: string, lessonSlug: string) =>
	await api.lessons['by-slug'].get({ query: { courseSlug, lessonSlug } })
