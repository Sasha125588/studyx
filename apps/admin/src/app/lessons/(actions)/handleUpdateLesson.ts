'use server'

import type { CreateLessonRequest } from './handleCreateLesson'

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
	// const response = await api
	// 	.lessons({ id })
	// 	.put({ title, slug, type, blocks: blocks as any, moduleId })

	const response = await fetch(`http://localhost:3000/api/lessons/${id}`, {
		method: 'PUT',
		body: JSON.stringify({ title, slug, type, blocks: blocks as any, moduleId }),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())

	return {
		data: response,
		error: response,
		status: response
	}
}
