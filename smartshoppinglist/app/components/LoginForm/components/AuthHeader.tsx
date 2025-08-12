import React from 'react'
import { CSS_CLASSES, UI_TEXT } from '../constants'

interface AuthHeaderProps {
  isLogin: boolean
  className?: string
}

/**
 * Auth Header Component
 * Single Responsibility: Display authentication section header
 */
export function AuthHeader({ isLogin, className = '' }: AuthHeaderProps) {
  const title = isLogin ? UI_TEXT.AUTH.LOGIN_TITLE : UI_TEXT.AUTH.SIGNUP_TITLE
  const subtitle = isLogin ? UI_TEXT.AUTH.LOGIN_SUBTITLE : UI_TEXT.AUTH.SIGNUP_SUBTITLE

  return (
    <div className={`text-center mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-gray-600 text-sm">
        {subtitle}
      </p>
    </div>
  )
}
