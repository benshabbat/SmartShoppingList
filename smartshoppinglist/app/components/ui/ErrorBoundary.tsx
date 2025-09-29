/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 */

'use client'

import React, { Component, ErrorInfo } from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

interface State {
  hasError: boolean
  error?: Error
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">משהו השתבש</h2>
      <p className="text-gray-600 mb-4">
        אירעה שגיאה לא צפויה. אנא נסה שנית.
      </p>
      <details className="text-left mb-4">
        <summary className="cursor-pointer text-sm text-gray-500 mb-2">
          פרטי השגיאה
        </summary>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
          {error.message}
        </pre>
      </details>
      <div className="flex gap-2 justify-center">
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          נסה שנית
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          טען מחדש
        </button>
      </div>
    </div>
  </div>
)

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // You could send this to a logging service
    // logErrorToService(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error)
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError, error }
}