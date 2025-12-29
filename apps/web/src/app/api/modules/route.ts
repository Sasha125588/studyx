import { NextRequest, NextResponse } from 'next/server'

import { api } from '@/lib/elysia/client'

export const GET = async (request: NextRequest) => {
	const { searchParams } = new URL(request.url)
	const courseId = searchParams.get('courseId')

	if (!courseId) {
		return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
	}

	try {
		const { data, error } = await api.modules.course({ courseId: Number(courseId) }).get()

		if (error) {
			return NextResponse.json({ error: error.value }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch modules:', error)
		return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
	}
}
