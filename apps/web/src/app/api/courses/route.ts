import { NextResponse } from 'next/server'

import { api } from '@/lib/elysia/client'

export const GET = async () => {
	try {
		const { data, error } = await api.courses.get()

		if (error) {
			return NextResponse.json({ error: error.value }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch courses:', error)
		return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
	}
}
