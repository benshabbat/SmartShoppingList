/**
 * Auth Error Handler
 * Single Responsibility: Handle authentication errors with Hebrew translations
 */

export class AuthErrorHandler {
  private static readonly ERROR_MESSAGES: Record<string, string> = {
    'Invalid login credentials': 'פרטי התחברות שגויים. אנא בדוק את המייל והסיסמה',
    'Email not confirmed': 'המייל לא אומת. אנא בדוק את תיבת המייל שלך ולחץ על הלינק לאימות, או המשך כאורח',
    'User already registered': 'המשתמש כבר רשום במערכת. נסה להתחבר במקום',
    'Password should be at least': 'הסיסמה חייבת להכיל לפחות 6 תווים',
    'Unable to validate email address': 'כתובת המייל לא תקינה',
  }

  static translateError(error: unknown): string {
    const errorMessage = (error as Error).message || 'אירעה שגיאה'

    // Find matching error message
    const matchingErrorKey = Object.keys(this.ERROR_MESSAGES).find(key => 
      errorMessage.includes(key)
    )

    return matchingErrorKey 
      ? this.ERROR_MESSAGES[matchingErrorKey]
      : errorMessage
  }

  static isKnownError(error: unknown): boolean {
    const errorMessage = (error as Error).message || ''
    return Object.keys(this.ERROR_MESSAGES).some(key => 
      errorMessage.includes(key)
    )
  }
}
