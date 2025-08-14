import { Card } from '../Card'
import { useLoginFormLogic } from './useLoginFormLogic'
import {
  BrandHeader,
  AuthHeader,
  GuestModeSection,
  Separator,
  FormField,
  Alert,
  AccountBenefitsSection,
  FormActions
} from './components'
import { CSS_CLASSES, UI_TEXT, LAYOUT, FORM_VALIDATION } from "./constants"

/**
 * Login Form UI Component
 * Zero Props Drilling - gets everything from context
 * Improved with SOLID, Clean Code, and DRY principles
 */
export function LoginFormUI() {
  const {
    // Form state
    isLogin,
    email,
    password,
    fullName,
    
    // UI state
    loading,
    error,
    message,
    
    // Validation
    isFormValid,
    
    // Event handlers
    handleGuestLogin,
    handleSubmit,
    handleForgotPassword: _handleForgotPassword,
    toggleMode: _toggleMode,
    clearMessages: _clearMessages,
    setEmail,
    setPassword,
    setFullName
  } = useLoginFormLogic()

  return (
    <div className={`${LAYOUT.CONTAINER} ${CSS_CLASSES.GRADIENT.BACKGROUND}`}>
      <div className={LAYOUT.FORM_WRAPPER}>
        {/* Brand Header */}
        <BrandHeader />

        <Card className={CSS_CLASSES.CARD.MAIN}>
          {/* Auth Header */}
          <AuthHeader isLogin={isLogin} />

          {/* Guest Mode Section */}
          <GuestModeSection onGuestLogin={handleGuestLogin} />

          {/* Separator */}
          <Separator />

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className={LAYOUT.SPACING.FORM}>
            {/* Full Name Field - Only for signup */}
            {!isLogin && (
              <FormField
                label={UI_TEXT.FORM.LABELS.FULL_NAME}
                type="text"
                value={fullName}
                onChange={setFullName}
                required={!isLogin}
                minLength={FORM_VALIDATION.MIN_FULLNAME_LENGTH}
              />
            )}

            {/* Email Field */}
            <FormField
              label={UI_TEXT.FORM.LABELS.EMAIL}
              type="email"
              value={email}
              onChange={setEmail}
              required
            />

            {/* Password Field */}
            <FormField
              label={UI_TEXT.FORM.LABELS.PASSWORD}
              type="password"
              value={password}
              onChange={setPassword}
              required
              minLength={FORM_VALIDATION.MIN_PASSWORD_LENGTH}
            />

            {/* Error Alert */}
            {error && <Alert type="error" message={error} />}

            {/* Success Alert */}
            {message && <Alert type="success" message={message} />}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`${CSS_CLASSES.GRADIENT.SECONDARY_BUTTON} ${CSS_CLASSES.BUTTON.SECONDARY}`}
            >
              {loading 
                ? UI_TEXT.FORM.BUTTONS.LOADING 
                : isLogin 
                  ? UI_TEXT.FORM.BUTTONS.LOGIN 
                  : UI_TEXT.FORM.BUTTONS.SIGNUP
              }
            </button>

            {/* Account Benefits */}
            <AccountBenefitsSection />
          </form>

          {/* Form Actions - ZERO PROPS DRILLING */}
          <FormActions />
        </Card>
      </div>
    </div>
  )
}
