import { useLoginFormLogic } from './useLoginFormLogic'
import { LoginFormUI } from './LoginFormUI'

/**
 * Container component that combines logic and UI
 * Zero Props Drilling - gets everything from context
 */
export function LoginForm() {
  const logic = useLoginFormLogic()

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
