'use server'

import { auth } from '@/lib/better-auth/server'

interface handleLoginProps {
  email: string
  password: string
}

export async function handleLogin({ email, password }: handleLoginProps) {
  return await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  })
}
