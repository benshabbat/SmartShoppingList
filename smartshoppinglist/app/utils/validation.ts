/**
 * Validation utilities following single responsibility principle
 */

import { ValidationResult, Validator } from '../types'

/**
 * Creates a required field validator
 */
export const required = (errorMessage = 'שדה זה הוא חובה'): Validator<string> => {
  return (value: string): ValidationResult => {
    const isValid = value.trim().length > 0
    return {
      isValid,
      error: isValid ? undefined : errorMessage
    }
  }
}

/**
 * Creates a minimum length validator
 */
export const minLength = (min: number, errorMessage?: string): Validator<string> => {
  return (value: string): ValidationResult => {
    const isValid = value.trim().length >= min
    return {
      isValid,
      error: isValid ? undefined : errorMessage || `מינימום ${min} תווים`
    }
  }
}

/**
 * Creates a maximum length validator
 */
export const maxLength = (max: number, errorMessage?: string): Validator<string> => {
  return (value: string): ValidationResult => {
    const isValid = value.trim().length <= max
    return {
      isValid,
      error: isValid ? undefined : errorMessage || `מקסימום ${max} תווים`
    }
  }
}

/**
 * Creates a pattern validator (regex)
 */
export const pattern = (regex: RegExp, errorMessage?: string): Validator<string> => {
  return (value: string): ValidationResult => {
    const isValid = regex.test(value)
    return {
      isValid,
      error: isValid ? undefined : errorMessage || 'פורמט לא תקין'
    }
  }
}

/**
 * Combines multiple validators
 */
export const combine = <T>(...validators: Validator<T>[]): Validator<T> => {
  return (value: T): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value)
      if (!result.isValid) {
        return result
      }
    }
    return { isValid: true }
  }
}

/**
 * Product name validator
 */
export const validateProductName = combine(
  required('שם המוצר הוא חובה'),
  minLength(2, 'שם המוצר חייב להכיל לפחות 2 תווים'),
  maxLength(50, 'שם המוצר לא יכול להכיל יותר מ-50 תווים')
)

/**
 * Category validator
 */
export const validateCategory = (categories: string[]): Validator<string> => {
  return (value: string): ValidationResult => {
    const isValid = categories.includes(value)
    return {
      isValid,
      error: isValid ? undefined : 'קטגוריה לא תקינה'
    }
  }
}

/**
 * Date validator for expiry dates
 */
export const validateExpiryDate: Validator<Date> = (value: Date): ValidationResult => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const isValid = value >= today
  return {
    isValid,
    error: isValid ? undefined : 'תאריך התפוגה חייב להיות בעתיד'
  }
}

// Alias for consistency with new utils
export const validateItemName = validateProductName

/**
 * Check for duplicate items
 */
export const checkDuplicateItem = (
  newItemName: string,
  existingItems: Array<{ name: string }>
): boolean => {
  return existingItems.some(item => 
    item.name.toLowerCase().trim() === newItemName.toLowerCase().trim()
  )
}
