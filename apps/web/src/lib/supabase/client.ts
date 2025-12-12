import type { Database } from '@studyx/database'
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	)
}

const db = createClient()

export default db
