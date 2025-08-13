/**
 * Common validation utilities to avoid repetition
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Common validation patterns
 */
export const validators = {
  /**
   * Validates that a string is not empty and meets minimum length
   */
  nonEmptyString: (value: string, minLength = 1, fieldName = 'שדה'): ValidationResult => {
    if (!value || value.trim().length < minLength) {
      return {
        isValid: false,
        error: `${fieldName} חייב להכיל לפחות ${minLength} תוים`
      }
    }
    return { isValid: true }
  },

  /**
   * Validates product name
   */
  productName: (name: string): ValidationResult => {
    return validators.nonEmptyString(name, 2, 'שם המוצר')
  },

  /**
   * Validates category
   */
  category: (category: string): ValidationResult => {
    return validators.nonEmptyString(category, 1, 'קטגוריה')
  },

  /**
   * Validates email format
   */
  email: (email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, error: 'כתובת מייל נדרשת' }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'כתובת מייל לא תקינה' }
    }
    
    return { isValid: true }
  },

  /**
   * Validates price
   */
  price: (price: number | undefined): ValidationResult => {
    if (price !== undefined && (isNaN(price) || price < 0)) {
      return { isValid: false, error: 'מחיר חייב להיות מספר חיובי' }
    }
    return { isValid: true }
  },

  /**
   * Validates date is not in the past
   */
  futureDate: (date: Date | undefined, fieldName = 'תאריך'): ValidationResult => {
    if (date && date < new Date()) {
      return { isValid: false, error: `${fieldName} לא יכול להיות בעבר` }
    }
    return { isValid: true }
  }
}

/**
 * Validates multiple fields and returns combined result
 */
export const validateMultiple = (...validations: ValidationResult[]): ValidationResult => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation
    }
  }
  return { isValid: true }
}

/**
 * Creates a validator function with common configuration
 */
export const createValidator = <T>(
  validatorFn: (value: T) => ValidationResult
) => validatorFn
