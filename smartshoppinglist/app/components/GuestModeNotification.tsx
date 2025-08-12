import React from 'react'
import { Info, User } from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'

export function GuestModeNotification() {
  const { isGuest, switchToAuth } = useAuth()

  if (!isGuest) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-900">
              אתה משתמש במצב אורח
            </h3>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            הנתונים שלך נשמרים במכשיר זה בלבד. כדי לסנכרן בין מכשירים ולגבות את הנתונים, התחבר עם חשבון.
          </p>
          <div className="flex gap-2">
            <button
              onClick={switchToAuth}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
            >
              התחבר עם חשבון
            </button>
            <button
              onClick={() => {
                const notification = document.querySelector('[data-guest-notification]')
                if (notification) {
                  notification.remove()
                }
              }}
              className="text-sm bg-white hover:bg-gray-50 text-blue-600 px-3 py-1.5 rounded-md border border-blue-300 transition-colors"
            >
              המשך כאורח
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
