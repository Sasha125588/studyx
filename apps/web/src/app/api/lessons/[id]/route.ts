import { NextRequest, NextResponse } from 'next/server'

import { api } from '@/lib/elysia/client'

export const GET = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params
		const { data, error } = await api.lessons({ id: Number(id) }).get()

		if (error) {
			return NextResponse.json({ error: error.value }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch lesson:', error)
		return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 })
	}
}

export const PUT = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params
		const body = await request.json()

		const { data, error } = await api.lessons({ id: Number(id) }).put(body)

		if (error) {
			return NextResponse.json({ error: error.value }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to update lesson:', error)
		return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
	}
}

export const DELETE = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params
		const { data, error } = await api.lessons({ id: Number(id) }).delete()

		if (error) {
			return NextResponse.json({ error: error.value }, { status: 500 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to delete lesson:', error)
		return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
	}
}
