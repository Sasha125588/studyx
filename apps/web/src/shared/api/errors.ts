import { NextResponse } from 'next/server'

export function isNextJsInternalError(error: unknown): error is Error & { digest: string } {
  if (typeof error !== 'object' || error === null || !('digest' in error)) {
    return false
  }

  const digest = (error as { digest?: string }).digest

  // Checks for NEXT_REDIRECT, NEXT_NOT_FOUND, etc.
  return typeof digest === 'string' && digest.startsWith('NEXT_')
}

export class APIError {
  success: boolean
  constructor(
    public message: string,
    public status: number,
    public code: string,
  ) {
    this.success = false
  }

  toResponse() {
    return NextResponse.json({
      success: this.success,
      error: this.message,
      code: this.code,
    }, { status: this.status })
  }
}

export class NotFoundError extends APIError {
  constructor(message = 'Not Found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class BadRequestError extends APIError {
  constructor(message = 'Bad Request') {
    super(message, 400, 'BAD_REQUEST')
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends APIError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ConflictError extends APIError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT')
  }
}

export class InternalServerError extends APIError {
  constructor(message = 'Internal Server Error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR')
  }
}

export class ValidationError extends APIError {
  constructor(message = 'Validation Error') {
    super(message, 422, 'VALIDATION_ERROR')
  }
}
