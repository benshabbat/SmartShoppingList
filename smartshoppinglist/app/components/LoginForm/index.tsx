import { LoginFormUI } from './LoginFormUI'

/**
 * Container component that combines logic and UI
 * Zero Props Drilling - LoginFormUI gets everything from context directly
 */
export function LoginForm() {
  return <LoginFormUI />
}
