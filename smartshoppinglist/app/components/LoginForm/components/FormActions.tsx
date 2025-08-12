import React from 'react'
import { CSS_CLASSES, UI_TEXT } from '../constants'

interface FormActionsProps {
  isLogin: boolean
  loading: boolean
  isFormValid: boolean
  onForgotPassword: () => void
  onToggleMode: () => void
  className?: string
}

/**
 * Form Actions Component
 * Single Responsibility: Handle form action buttons and links
 */
export function FormActions({
  isLogin,
  loading,
  isFormValid,
  onForgotPassword,
  onToggleMode,
  className = ''
}: FormActionsProps) {
  return (
    <div className={`mt-6 text-center space-y-2 ${className}`}>
      {isLogin && (
        <button
          type="button"
          onClick={onForgotPassword}
          className={CSS_CLASSES.BUTTON.LINK}
          disabled={loading}
        >
          {UI_TEXT.FORM.BUTTONS.FORGOT_PASSWORD}
        </button>
      )}

      <div>
        <button
          type="button"
          onClick={onToggleMode}
          className={CSS_CLASSES.BUTTON.LINK}
        >
          {isLogin ? UI_TEXT.FORM.TOGGLE.TO_SIGNUP : UI_TEXT.FORM.TOGGLE.TO_LOGIN}
        </button>
      </div>
    </div>
  )
}
