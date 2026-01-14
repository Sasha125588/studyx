import { treaty } from '@elysiajs/eden'

import type { App } from '@/app/api/[[...slugs]]/route'
import { IS_VERCEL } from '@/shared/constants/env'

export const api = treaty<App>(
	typeof window === 'undefined'
		? ((IS_VERCEL ? process.env.NEXT_PUBLIC_FRONTEND_VERCEL_URL : null) ?? 'http://localhost:3024')
		: window.location.origin
).api

// export const api =
//   // process is defined on server side and build time
//   typeof process !== 'undefined'
//     ? treaty(app).api
//     : treaty<typeof app>('localhost:3000').api
