/**
 * Validation & Error Types - Error Handling and Form Validation
 * Contains all types related to validation, error handling, and form state management
 */

// === VALIDATION TYPES ===

export interface ValidationResult {
  isValid: boolean
  error?: string
  errors?: string[]
}

export type Validator<T> = (value: T) => ValidationResult
export type ErrorType = 'validation' | 'business' | 'system'

export interface AppError {
  type: ErrorType
  message: string
  code?: string
  details?: unknown
}

export interface ErrorHandlerOptions {
  logToConsole?: boolean
  showToast?: boolean
  fallbackMessage?: string
}

export interface AuthError {
  code: string
  message: string
}

// === FORM COMPONENT TYPES ===

// Base form field props
export interface BaseFormFieldProps {
  className?: string
  disabled?: boolean
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
}

export interface FormFieldProps extends BaseFormFieldProps {
  label: string
  type: 'email' | 'password' | 'text'
  minLength?: number
}

export interface AlertProps {
  className?: string
  disabled?: boolean
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

export interface SeparatorProps {
  className?: string
  disabled?: boolean
  text?: string
}

export interface GuestModeSectionProps {
  className?: string
  disabled?: boolean
  onGuestLogin: () => void
}

export interface AccountBenefitsSectionProps {
  className?: string
  disabled?: boolean
}

// Auth Header types
export interface AuthHeaderProps {
  className?: string
  disabled?: boolean
  isLogin: boolean
}

export interface BrandHeaderProps {
  className?: string
  disabled?: boolean
}
