'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/server'

export async function handleSignOut() {
  await auth.api.signOut({
    headers: await headers(),
  })
}
