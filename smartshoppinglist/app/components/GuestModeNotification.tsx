import React, { useState, useEffect } from 'react'
import { User, X } from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'

export function GuestModeNotification() {
  const { isGuest, switchToAuth } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)
  const [showMinimized, setShowMinimized] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed this notification
    const dismissed = localStorage.getItem('guest_notification_dismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
    
    // Auto-minimize after 30 seconds
    const timer = setTimeout(() => {
      setShowMinimized(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('guest_notification_dismissed', 'true')
  }

  const handleTemporaryHide = () => {
    setShowMinimized(true)
  }

  if (!isGuest || isDismissed) return null

  // Minimized version
  if (showMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-slide-in-top">
        <button
          onClick={() => setShowMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="הצג הודעת אורח"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200 rounded-xl p-4 mb-6 shadow-lg animate-slide-in-top" data-guest-notification>
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 rounded-full p-2">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-blue-900">
              🚀 ברוך הבא למצב אורח!
            </h3>
            <div className="flex gap-1">
              <button
                onClick={handleTemporaryHide}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                title="הסתר זמנית"
              >
                <span className="text-blue-600 text-xs">_</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                title="סגור הודעה"
              >
                <X className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
          <p className="text-sm text-blue-700 mb-3 leading-relaxed">
            התחל לנהל את רשימת הקניות שלך מיד! הנתונים נשמרים באופן מקומי במכשיר זה. 
            כדי לסנכרן בין מכשירים ולגבות נתונים, רק התחבר עם חשבון.
          </p>
          <div className="flex gap-2">
            <button
              onClick={switchToAuth}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              📱 התחבר עם חשבון
            </button>
            <button
              onClick={handleDismiss}
              className="text-sm bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-300 transition-all duration-200 hover:border-blue-400"
            >
              ✓ המשך כאורח
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
