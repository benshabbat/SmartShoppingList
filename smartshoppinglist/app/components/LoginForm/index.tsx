import { LoginFormUI } from './LoginFormUI'

/**
 * Container component that combines logic and UI
 * Zero Props Drilling - LoginFormUI gets everything from context directly
 * 
 * Improved with SOLID principles:
 * - Single Responsibility: Acts as a simple container
 * - Open/Closed: Extensible through props if needed
 * - Dependency Inversion: Depends on LoginFormUI abstraction
 */
export function LoginForm() {
  return <LoginFormUI />
}

// Export for direct usage if needed
export { LoginFormUI } from './LoginFormUI'
