/**
 * Error handling utilities following clean code principles
 */

import { MESSAGES } from './appConstants'

export type ErrorType = 'validation' | 'business' | 'system'

export interface AppError {
  type: ErrorType
  message: string
  code?: string
  details?: unknown
}

export class ValidationError extends Error {
  public readonly type: ErrorType = 'validation'
  public readonly code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'ValidationError'
    this.code = code
  }
}

export class BusinessError extends Error {
  public readonly type: ErrorType = 'business'
  public readonly code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
  }
}

/**
 * Error factory for common validation errors
 */
export const createValidationError = {
  productNameTooShort: () => new ValidationError(MESSAGES.ERROR.NAME_TOO_SHORT, 'NAME_TOO_SHORT'),
  productNameTooLong: () => new ValidationError(MESSAGES.ERROR.NAME_TOO_LONG, 'NAME_TOO_LONG'),
  productNameInvalid: () => new ValidationError(MESSAGES.ERROR.INVALID_NAME, 'INVALID_NAME'),
  productExists: () => new ValidationError(MESSAGES.ERROR.PRODUCT_EXISTS, 'PRODUCT_EXISTS'),
}

/**
 * Error factory for common business errors
 */
export const createBusinessError = {
  emptyCart: () => new BusinessError(MESSAGES.ERROR.EMPTY_CART, 'EMPTY_CART'),
  noItemsToPurchase: () => new BusinessError(MESSAGES.ERROR.NO_ITEMS_TO_PURCHASE, 'NO_ITEMS_TO_PURCHASE'),
}

/**
 * Safe error handler that ensures errors are properly formatted
 */
export const handleError = (error: unknown): AppError => {
  if (error instanceof ValidationError || error instanceof BusinessError) {
    return {
      type: error.type,
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      type: 'system',
      message: error.message,
      details: error,
    }
  }

  return {
    type: 'system',
    message: 'An unknown error occurred',
    details: error,
  }
}

/**
 * Type guard to check if an error is of a specific type
 */
export const isErrorOfType = (error: AppError, type: ErrorType): boolean => {
  return error.type === type
}

/**
 * Type guard to check if an error has a specific code
 */
export const hasErrorCode = (error: AppError, code: string): boolean => {
  return error.code === code
}
