'use server'

import { cookies } from 'next/headers'

export const setLocale = async (locale: string) => {
	;(await cookies()).set('locale', locale, { path: '/' })
}
