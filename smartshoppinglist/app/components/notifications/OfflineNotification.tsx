/**
 * Offline Status Notification Component
 * Shows user when they're working offline and data won't sync
 */

'use client'

import React, { useState, useEffect } from 'react'
import { WifiOff, Wifi, AlertCircle } from 'lucide-react'

export const OfflineNotification: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      // Auto-hide success notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Don't show if online and no notification needed
  if (isOnline && !showNotification) {
    return null
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`rounded-lg shadow-lg p-4 max-w-sm ${
        isOnline 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-orange-50 border border-orange-200 text-orange-800'
      }`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-orange-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-sm">
              {isOnline ? 'חזר חיבור לאינטרנט!' : 'אין חיבור לאינטרנט'}
            </h3>
            <p className="text-xs mt-1 opacity-90">
              {isOnline 
                ? 'הנתונים יסונכרנו כעת' 
                : 'האפליקציה תפעל במצב אורח. הנתונים יישמרו מקומית.'
              }
            </p>
          </div>

          {!isOnline && (
            <button
              onClick={() => setShowNotification(false)}
              className="flex-shrink-0 text-orange-600 hover:text-orange-800 transition-colors"
              aria-label="סגור התראה"
            >
              <AlertCircle className="h-4 w-4" />
            </button>
          )}
        </div>

        {!isOnline && (
          <div className="mt-3 text-xs">
            <div className="bg-orange-100 rounded p-2">
              <strong>במצב אורח תוכלו:</strong>
              <ul className="mt-1 space-y-0.5 text-orange-700">
                <li>• להוסיף ולערוך פריטים</li>
                <li>• לנהל את רשימת הקניות</li>
                <li>• לראות הקניות האחרונות שנשמרו</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook to check online status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Connection status indicator for the header
export const ConnectionStatus: React.FC = () => {
  const isOnline = useOnlineStatus()

  return (
    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
      isOnline 
        ? 'bg-green-100 text-green-700' 
        : 'bg-orange-100 text-orange-700'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>מחובר</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>אורח</span>
        </>
      )}
    </div>
  )
}