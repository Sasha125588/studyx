import { NextRequest, NextResponse } from 'next/server'

import { api } from '@/lib/elysia/client'

export const GET = async () => {
	try {
		const { data, error } = await api.lessons.get()

		if (error) {
			return NextResponse.json({ error: error.value }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch lessons:', error)
		return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
	}
}

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json()

		const { data, error } = await api.lessons.post(body)

		if (error) {
			return NextResponse.json({ error: error.value }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to create lesson:', error)
		return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
	}
}
