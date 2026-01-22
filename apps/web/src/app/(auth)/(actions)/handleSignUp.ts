'use server'

import { auth } from '@/lib/better-auth/server'

interface handleSignUpProps {
  name: string
  email: string
  password: string
}

export async function handleSignUp({ name, email, password }: handleSignUpProps) {
  return await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  })
}
