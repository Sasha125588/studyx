'use server'

import { cookies } from 'next/headers'

import { COOKIES } from '@/app/(constants)/cookies'

export async function setLocale(locale: string) {
  ;(await cookies()).set(COOKIES.LOCALE, locale, { path: '/' })
}
