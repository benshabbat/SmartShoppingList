import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle, User, ArrowRight } from 'lucide-react'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'

export function WelcomeMessage() {
  const { showWelcomeMessage, welcomeUserName, closeWelcome } = useGlobalShopping()
  const [isVisible, setIsVisible] = useState(false)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(closeWelcome, 300) // Wait for animation to complete
  }, [closeWelcome])

  useEffect(() => {
    if (showWelcomeMessage) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        handleClose()
      }, 5000) // Auto close after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [showWelcomeMessage, handleClose])

  if (!showWelcomeMessage) return null

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-green-900">
                🎉 ברוך הבא!
              </h3>
            </div>
            <p className="text-sm text-green-700 mb-3 leading-relaxed">
              {welcomeUserName ? `שלום ${welcomeUserName}!` : 'נחמד להכיר!'} עברת בהצלחה ממצב אורח למשתמש רשום.
              כעת הנתונים שלך יסונכרנו בין כל המכשירים שלך.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <User className="w-3 h-3" />
              <ArrowRight className="w-3 h-3" />
              <span>סינכרון מלא</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-green-600 hover:text-green-800 text-sm p-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
