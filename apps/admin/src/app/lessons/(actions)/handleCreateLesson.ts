'use server'

import type { LessonBlock, LessonType } from '@studyx/types'

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
	// const response = await api.lessons.post({ title, slug, type, blocks: blocks as any, moduleId })

	const response = await fetch('http://localhost:3000/api/lessons', {
		method: 'POST',
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
