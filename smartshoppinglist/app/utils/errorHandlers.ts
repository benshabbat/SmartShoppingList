/**
 * Common error handling utilities to avoid repetition
 */

/**
 * Standard async error handler that logs the error and shows a user-friendly message
 */
export const handleAsyncError = (
  error: unknown,
  userMessage: string,
  showError: (message: string) => void,
  context?: string
) => {
  console.error(context ? `Error in ${context}:` : 'Error:', error)
  showError(userMessage)
}

/**
 * Creates a standardized error handler for async operations
 */
export const createErrorHandler = (
  showError: (message: string) => void,
  context?: string
) => {
  return (error: unknown, userMessage: string) => {
    handleAsyncError(error, userMessage, showError, context)
  }
}

/**
 * Wrapper for async operations with standardized error handling
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  showError: (message: string) => void,
  context?: string
): Promise<T | null> => {
  try {
    return await operation()
  } catch (error) {
    handleAsyncError(error, errorMessage, showError, context)
    return null
  }
}

/**
 * Common success message patterns
 */
export const createSuccessMessage = {
  added: (itemName: string) => `${itemName} נוסף לרשימה`,
  removed: (itemName: string) => `${itemName} הוסר מהרשימה`,
  addedToCart: (itemName: string) => `${itemName} נוסף לסל`,
  removedFromCart: (itemName: string) => `${itemName} הוסר מהסל`,
  updated: (itemName: string) => `${itemName} עודכן`,
  bulk: (count: number, operation: string) => `${operation} ${count} פריטים`,
  purchaseCompleted: () => 'הקנייה הושלמה בהצלחה!',
}

/**
 * Common error message patterns
 */
export const createErrorMessage = {
  adding: () => 'שגיאה בהוספת הפריט',
  removing: () => 'שגיאה במחיקת הפריט',
  updating: () => 'שגיאה בעדכון הפריט',
  loading: () => 'שגיאה בטעינת הנתונים',
  saving: () => 'שגיאה בשמירת הנתונים',
  network: () => 'בעיית רשת - נסה שוב',
  purchase: () => 'שגיאה בהשלמת הקנייה',
  generic: () => 'אירעה שגיאה - נסה שוב',
}
