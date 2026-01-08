/* eslint-disable no-restricted-syntax */
export const isNextJsInternalError = (error: unknown): error is Error & { digest: string } => {
	if (typeof error !== 'object' || error === null || !('digest' in error)) {
		return false
	}

	const digest = (error as { digest?: string }).digest

	// Checks for NEXT_REDIRECT, NEXT_NOT_FOUND, etc.
	return typeof digest === 'string' && digest.startsWith('NEXT_')
}

export class APIError extends Error {
	constructor(
		public message: string,
		public status: number,
		public code: string
	) {
		super(message)
		this.name = 'APIError'
	}
}
