/**
 * Error handling utilities for consistent error management across the app
 */

export interface ErrorHandlerOptions {
  logToConsole?: boolean
  showToast?: boolean
  fallbackMessage?: string
}

export const createErrorHandler = (
  context: string,
  showError: (message: string) => void,
  options: ErrorHandlerOptions = {}
) => {
  const { logToConsole = true, showToast = true, fallbackMessage = 'אירעה שגיאה' } = options

  return (error: unknown, customMessage?: string) => {
    const message = customMessage || fallbackMessage
    
    if (logToConsole) {
      console.error(`Error in ${context}:`, error)
    }
    
    if (showToast) {
      showError(message)
    }
  }
}

export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  errorHandler: (error: unknown, message?: string) => void,
  errorMessage?: string
): Promise<T | null> => {
  try {
    return await operation()
  } catch (error) {
    errorHandler(error, errorMessage)
    return null
  }
}

export const createAsyncHandler = (
  context: string,
  showError: (message: string) => void,
  options: ErrorHandlerOptions = {}
) => {
  const errorHandler = createErrorHandler(context, showError, options)
  
  return <T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    return handleAsyncOperation(operation, errorHandler, errorMessage)
  }
}
