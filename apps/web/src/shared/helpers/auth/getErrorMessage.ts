import type { auth } from '@/lib/better-auth/server'

type ErrorCodes = keyof typeof auth.$ERROR_CODES

const errorMessages: Partial<Record<ErrorCodes, string>> = {
  USER_NOT_FOUND: 'User not found',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_CREATE_SESSION: 'Failed to create session',
  FAILED_TO_UPDATE_USER: 'Failed to update user',
  FAILED_TO_GET_SESSION: 'Failed to get session',
  INVALID_PASSWORD: 'Password is incorrect',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Social account is already linked',
  PROVIDER_NOT_FOUND: 'Authentication provider not found',
  INVALID_TOKEN: 'Invalid or expired token',
  ID_TOKEN_NOT_SUPPORTED: 'ID token is not supported',
  FAILED_TO_GET_USER_INFO: 'Failed to get user information',
  USER_EMAIL_NOT_FOUND: 'User email not found',
  EMAIL_NOT_VERIFIED: 'Email is not verified',
  PASSWORD_TOO_SHORT: 'Password is too short',
  PASSWORD_TOO_LONG: 'Password is too long',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'User already exists. Use another email',
  EMAIL_CAN_NOT_BE_UPDATED: 'Email cannot be updated',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Credential account not found',
  SESSION_EXPIRED: 'Session has expired',
  FAILED_TO_UNLINK_LAST_ACCOUNT: 'Cannot unlink the last account',
  ACCOUNT_NOT_FOUND: 'Account not found',
  USER_ALREADY_HAS_PASSWORD: 'User already has password',
} as const

export function getErrorMessage(code: string) {
  const message = code.replaceAll('.', '').replaceAll(' ', '_').toUpperCase() // Invalid email or password -> INVALID_EMAIL_OR_PASSWORD
  return errorMessages[message as ErrorCodes] ?? 'Unknown error'
}
