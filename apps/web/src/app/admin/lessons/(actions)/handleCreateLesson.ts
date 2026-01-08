 
'use server'

import type { LessonBlock, LessonType } from '@studyx/types'

import { api } from '@/lib/elysia/client'

 

 

 

 

 

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface CreateLessonRequest {
	title: string
	slug: string
	type: LessonType
	blocks: LessonBlock[]
	moduleId: number
}

export const handleCreateLesson = async ({
	title,
	slug,
	type,
	blocks,
	moduleId
}: CreateLessonRequest) => {
	const response = await api.lessons.post({ title, slug, type, blocks: blocks as any, moduleId })

	return {
		data: response.data,
		error: response.error,
		status: response.status
	}
}
