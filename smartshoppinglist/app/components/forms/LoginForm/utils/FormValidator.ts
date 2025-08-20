import { FORM_VALIDATION } from '../constants'
import { ValidationResult } from '../../../../types'

/**
 * Form Validator
 * Single Responsibility: Validate form inputs
 */

export class FormValidator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = []
    
    if (!email) {
      errors.push('כתובת מייל נדרשת')
    } else if (!email.includes('@')) {
      errors.push('כתובת מייל לא תקינה')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = []
    
    if (!password) {
      errors.push('סיסמה נדרשת')
    } else if (password.length < FORM_VALIDATION.MIN_PASSWORD_LENGTH) {
      errors.push(`הסיסמה חייבת להכיל לפחות ${FORM_VALIDATION.MIN_PASSWORD_LENGTH} תווים`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validateFullName(fullName: string): ValidationResult {
    const errors: string[] = []
    const trimmedName = fullName.trim()
    
    if (!trimmedName) {
      errors.push('שם מלא נדרש')
    } else if (trimmedName.length < FORM_VALIDATION.MIN_FULLNAME_LENGTH) {
      errors.push(`השם חייב להכיל לפחות ${FORM_VALIDATION.MIN_FULLNAME_LENGTH} תווים`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validateLoginForm(email: string, password: string): ValidationResult {
    const emailValidation = this.validateEmail(email)
    const passwordValidation = this.validatePassword(password)

    return {
      isValid: emailValidation.isValid && passwordValidation.isValid,
      errors: [...(emailValidation.errors || []), ...(passwordValidation.errors || [])]
    }
  }

  static validateSignupForm(email: string, password: string, fullName: string): ValidationResult {
    const emailValidation = this.validateEmail(email)
    const passwordValidation = this.validatePassword(password)
    const fullNameValidation = this.validateFullName(fullName)

    return {
      isValid: emailValidation.isValid && passwordValidation.isValid && fullNameValidation.isValid,
      errors: [...(emailValidation.errors || []), ...(passwordValidation.errors || []), ...(fullNameValidation.errors || [])]
    }
  }
}
