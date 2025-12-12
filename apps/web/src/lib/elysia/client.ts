import type { App } from '@api'
import { treaty } from '@elysiajs/eden'

const getApiUrl = () =>
	process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL! : 'http://localhost:4000'

export const api = treaty<App>(getApiUrl())
