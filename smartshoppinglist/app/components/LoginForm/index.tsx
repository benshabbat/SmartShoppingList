import { useLoginFormLogic } from './useLoginFormLogic'
import { LoginFormUI } from './LoginFormUI'

interface LoginFormProps {
  onSuccess?: () => void
}

/**
 * Container component that combines logic and UI
 * Follows the Container/Presentational pattern
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const logic = useLoginFormLogic({ onSuccess })

  return (
    <LoginFormUI
      isLogin={logic.isLogin}
      email={logic.email}
      password={logic.password}
      fullName={logic.fullName}
      loading={logic.loading}
      error={logic.error}
      message={logic.message}
      isFormValid={logic.isFormValid}
      onGuestLogin={logic.handleGuestLogin}
      onSubmit={logic.handleSubmit}
      onForgotPassword={logic.handleForgotPassword}
      onToggleMode={logic.toggleMode}
      onClearMessages={logic.clearMessages}
      onEmailChange={logic.setEmail}
      onPasswordChange={logic.setPassword}
      onFullNameChange={logic.setFullName}
    />
  )
}
