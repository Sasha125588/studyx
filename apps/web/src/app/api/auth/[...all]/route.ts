import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/better-auth/server'

export const { GET, POST } = toNextJsHandler(auth)
