 
'use server'

import type { CreateLessonRequest } from './handleCreateLesson'
import { api } from '@/lib/elysia/client'

 

 

 

 

/* eslint-disable @typescript-eslint/no-explicit-any */

interface UpdateLessonRequest extends CreateLessonRequest {
	id: number
}

export const handleUpdateLesson = async ({
	id,
	title,
	slug,
	type,
	blocks,
	moduleId
}: UpdateLessonRequest) => {
	const response = await api
		.lessons({ id })
		.put({ title, slug, type, blocks: blocks as any, moduleId })

	return {
		data: response.data,
		error: response.error,
		status: response.status
	}
}
