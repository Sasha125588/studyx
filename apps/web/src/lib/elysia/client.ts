import type { App } from '@api'
import { treaty } from '@elysiajs/eden'

export const api = treaty<App>(
	process.env.NODE_ENV === 'production'
		? process.env.NEXT_PUBLIC_API_RAILWAY_URL!
		: 'http://localhost:4000'
)
