import { useState, useEffect } from 'react'
import { User, X } from 'lucide-react'
import { useAuth } from '../../hooks'
import { useMainAppLogic } from '../layout/MainAppContent/useMainAppLogic'

/**
 * Guest Mode Notification Component
 * Zero Props Drilling - gets everything from context
 */
export function GuestModeNotification() {
  const { isGuest, switchToAuth } = useAuth()
  const { handleGuestDataImport } = useMainAppLogic()
  const [isDismissed, setIsDismissed] = useState(false)
  const [showMinimized, setShowMinimized] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed this notification
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('guest_notification_dismissed')
      if (dismissed === 'true') {
        setIsDismissed(true)
      }
    }
    
    // Auto-minimize after 30 seconds
    const timer = setTimeout(() => {
      setShowMinimized(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_notification_dismissed', 'true')
    }
    // Call the guest data import handler from context
    handleGuestDataImport()
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
    <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 backdrop-blur-sm border border-blue-200/50 rounded-lg p-3 mb-4 shadow-md animate-slide-in-top" data-guest-notification>
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 rounded-full p-2">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-blue-900">
                מצב אורח פעיל
              </h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                שמירה מקומית
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  const confirmSwitch = confirm(
                    '⚠️ הודעה חשובה!\n\n' +
                    'כאשר תעבור למצב התחברות עם חשבון, הנתונים הנוכחיים שנשמרו במכשיר זה לא יימחקו, ' +
                    'אבל הם גם לא יסונכרנו אוטומטית לחשבון החדש.\n\n' +
                    'אם יש לך נתונים חשובים, וודא שאתה זוכר אותם או תעשה צילום מסך לפני המעבר.\n\n' +
                    'האם אתה בטוח שברצונך להמשיך להתחברות?'
                  )
                  
                  if (confirmSwitch) {
                    switchToAuth()
                  }
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors"
                title="התחבר עם חשבון"
              >
                💫 התחבר
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
        </div>
      </div>
    </div>
  )
}
