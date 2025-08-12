import React, { useState } from 'react'
import { UserService } from '@/lib/services/userService'
import { useAuth } from '@/app/hooks/useAuth'
import { Card } from './Card'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signInAsGuest } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleGuestLogin = () => {
    signInAsGuest()
    onSuccess?.()
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
      setError((err as Error).message || 'אירעה שגיאה')
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 shadow-lg mx-auto mb-4 w-20 h-20 flex items-center justify-center">
            <span className="text-white text-3xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            רשימת קניות חכמה
          </h1>
          <p className="text-gray-600 text-sm">
            נהל את הקניות שלך בקלות ויעילות
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {isLogin ? '🔐 התחברות' : '📝 הרשמה'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin ? 'ברוכים השבים לרשימת הקניות החכמה!' : 'הצטרפו למשפחת הקונים החכמים'}
            </p>
          </div>

          {/* Guest Mode Explanation */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-bold text-blue-900 mb-2">מצב אורח - התחל מיד!</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                התחל לנהל את רשימת הקניות שלך מיד ללא רישום. הנתונים יישמרו במכשיר זה באופן מקומי.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🛒</span>
              התחל כאורח - ללא רישום!
            </button>
            
            <div className="mt-3 text-xs text-blue-600 text-center space-y-1">
              <div>✅ התחלה מיידית ללא רישום</div>
              <div>✅ שמירה מקומית במכשיר</div>
              <div>✅ אפשרות להירשם מאוחר יותר</div>
            </div>
          </div>

          {/* Or Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">או התחבר עם חשבון</span>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מייל
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {loading ? '⏳ מתבצע...' : isLogin ? '� התחבר עם חשבון' : '✨ הירשם עם חשבון'}
          </button>

          {/* Account Benefits */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 text-center leading-relaxed">
              <strong>🌟 יתרונות החשבון:</strong> סנכרון בין מכשירים • גיבוי ענן • שיתוף רשימות • סטטיסטיקות מתקדמות
            </p>
          </div>
        </form>

        <div className="mt-6 text-center space-y-2">
          {isLogin && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 hover:text-blue-800 text-sm"
              disabled={loading}
            >
              שכחת סיסמה?
            </button>
          )}

          <div>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
                setMessage(null)
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin ? 'אין לך חשבון? הירשם כאן' : 'יש לך חשבון? התחבר כאן'}
            </button>
          </div>
        </div>
      </Card>
      </div>
    </div>
  )
}
