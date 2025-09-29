import { useState } from 'react'
import { useLogin, useSignUp } from '../../../hooks'
import { useAuth } from '../../../hooks'
import { useGlobalShopping } from '../../../contexts/GlobalShoppingContext'
import { useMainAppLogic } from '../../layout/MainAppContent/useMainAppLogic'
import { AuthErrorHandler, FormValidator } from './utils'

/**
 * Custom hook for LoginForm business logic
 * Zero Props Drilling - gets everything from context
 */
export const useLoginFormLogic = () => {
  const { signInAsGuest } = useAuth()
  const { showWelcome } = useGlobalShopping()
  const { handleLoginSuccess } = useMainAppLogic()
  const loginMutation = useLogin()
  const signUpMutation = useSignUp()
  
  // Form state
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)

  // Event handlers
  const handleGuestLogin = () => {
    try {
      signInAsGuest()
    } catch {
      setError('שגיאה במעבר למצב אורח')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Form submitted:', { isLogin, email: email.substring(0, 3) + '***' })
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isLogin) {
        console.log('🔐 Attempting login...')
        const result = await loginMutation.mutateAsync({ email, password })
        console.log('✅ Login result:', result?.user?.email)
        setMessage('התחברת בהצלחה!')
        
        // Show welcome message for successful login
        if (result?.user) {
          showWelcome(result.user.user_metadata?.full_name || result.user.email)
        }
        
        handleLoginSuccess()
      } else {
        console.log('📝 Attempting signup...')
        await signUpMutation.mutateAsync({ 
          email, 
          password, 
          options: { 
            data: { 
              full_name: fullName 
            } 
          } 
        })
        console.log('✅ Signup completed')
        setMessage('נרשמת בהצלחה! בדוק את המייל שלך לאימות החשבון.')
      }
    } catch (err: unknown) {
      console.error('❌ Auth error:', err)
      const errorMessage = AuthErrorHandler.translateError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true)
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

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false)
  }

  // Validation
  const isEmailValid = FormValidator.validateEmail(email).isValid
  const isPasswordValid = FormValidator.validatePassword(password).isValid
  const isFullNameValid = FormValidator.validateFullName(fullName).isValid
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
    showForgotPasswordModal,
    
    // Validation
    isEmailValid,
    isPasswordValid,
    isFullNameValid,
    isFormValid,
    
    // Event handlers
    handleGuestLogin,
    handleSubmit,
    handleForgotPassword,
    handleCloseForgotPasswordModal,
    toggleMode,
    clearMessages,
    
    // Setters
    setEmail,
    setPassword,
    setFullName,
  }
}
