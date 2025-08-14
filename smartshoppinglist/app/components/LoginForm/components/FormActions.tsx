import { useLoginFormLogic } from '../useLoginFormLogic'
import { CSS_CLASSES, UI_TEXT } from '../constants'

/**
 * Form Actions Component - ZERO PROPS DRILLING
 * Single Responsibility: Handle form action buttons and links
 * Gets everything from context!
 */
export function FormActions() {
  const { 
    isLogin, 
    loading, 
    isFormValid: _isFormValid, 
    handleForgotPassword, 
    toggleMode 
  } = useLoginFormLogic()

  return (
    <div className="mt-6 text-center space-y-2">
      {isLogin && (
        <button
          type="button"
          onClick={handleForgotPassword}
          className={CSS_CLASSES.BUTTON.LINK}
          disabled={loading}
        >
          {UI_TEXT.FORM.BUTTONS.FORGOT_PASSWORD}
        </button>
      )}

      <div>
        <button
          type="button"
          onClick={toggleMode}
          className={CSS_CLASSES.BUTTON.LINK}
        >
          {isLogin ? UI_TEXT.FORM.TOGGLE.TO_SIGNUP : UI_TEXT.FORM.TOGGLE.TO_LOGIN}
        </button>
      </div>
    </div>
  )
}
