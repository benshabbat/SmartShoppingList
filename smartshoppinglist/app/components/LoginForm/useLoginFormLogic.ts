import { useState } from 'react'
import { UserService } from '../../../lib/services/userService'
import { useAuth } from '../../hooks/useAuth'

interface UseLoginFormLogicProps {
  onSuccess?: () => void
}

/**
 * Custom hook for LoginForm business logic
 * Handles form state, validation, authentication, and error handling
 */
export const useLoginFormLogic = ({ onSuccess }: UseLoginFormLogicProps) => {
  const { signInAsGuest } = useAuth()
  
  // Form state
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Event handlers
  const handleGuestLogin = () => {
    console.log('🎯 handleGuestLogin called')
    signInAsGuest()
    console.log('🎯 signInAsGuest executed')
    // Don't call onSuccess for guest login - let the state change trigger re-render naturally
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isLogin) {
        await UserService.signIn(email, password)
        setMessage('התחברת בהצלחה!')
        onSuccess?.()
      } else {
        await UserService.signUp(email, password, fullName)
        setMessage('נרשמת בהצלחה! בדוק את המייל שלך לאימות החשבון.')
      }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'אירעה שגיאה'
      
      // Handle specific Supabase errors with Hebrew messages
      if (errorMessage.includes('Invalid login credentials')) {
        setError('פרטי התחברות שגויים. אנא בדוק את המייל והסיסמה')
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('המייל לא אומת. אנא בדוק את תיבת המייל שלך ולחץ על הלינק לאימות')
      } else if (errorMessage.includes('User already registered')) {
        setError('המשתמש כבר רשום במערכת. נסה להתחבר במקום')
      } else if (errorMessage.includes('Password should be at least')) {
        setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      } else if (errorMessage.includes('Unable to validate email address')) {
        setError('כתובת המייל לא תקינה')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('אנא הכנס כתובת מייל תחילה')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await UserService.resetPassword(email)
      setMessage('נשלח לינק לאיפוס סיסמה למייל שלך')
    } catch (err: unknown) {
      setError((err as Error).message || 'אירעה שגיאה')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setMessage(null)
  }

  const clearMessages = () => {
    setError(null)
    setMessage(null)
  }

  // Validation
  const isEmailValid = email.includes('@')
  const isPasswordValid = password.length >= 6
  const isFullNameValid = fullName.trim().length >= 2
  const isFormValid = isEmailValid && isPasswordValid && (isLogin || isFullNameValid)

  return {
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
    isEmailValid,
    isPasswordValid,
    isFullNameValid,
    isFormValid,
    
    // Event handlers
    handleGuestLogin,
    handleSubmit,
    handleForgotPassword,
    toggleMode,
    clearMessages,
    
    // Setters
    setEmail,
    setPassword,
    setFullName,
  }
}
