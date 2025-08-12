// Main app content with clean architecture and reduced props drilling
'use client'

import { useState } from 'react'
import { useShoppingListContext } from '../providers'
import { useAuthContext } from '../hooks'

// UI Components
import { Header } from './Header'
import { LoginForm } from './LoginForm'
import { MainShoppingView } from './MainShoppingView'
import { ToastContainer } from './Toast'
import { Tutorial } from './Tutorial'
import { LoadingOverlay } from './LoadingOverlay'
import { GuestModeNotification } from './GuestModeNotification'

// Types
import { ShoppingItem } from '../types'

export function MainAppContent() {
  const { loading, isAuthenticated, isGuest } = useAuthContext()
  const {
    showTutorial,
    closeTutorial,
    hasGuestData,
    importGuestData,
    showSuccess,
  } = useShoppingListContext()
  
  // Local UI state
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showReceiptScanner, setShowReceiptScanner] = useState(false)

  // Show loading state
  if (loading) {
    return <LoadingOverlay message="טוען..." />
  }

  // Show login form if not authenticated and not guest
  if (!isAuthenticated && !isGuest && showLoginForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm onSuccess={() => setShowLoginForm(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onOpenReceiptScanner={() => setShowReceiptScanner(true)}
      />

      {/* Guest Mode Notification */}
      {isGuest && hasGuestData() && (
        <GuestModeNotification
          onDismiss={() => {
            importGuestData()
            showSuccess('הנתונים יובאו בהצלחה!')
          }}
        />
      )}

      {/* Main Content */}
      <MainShoppingView />

      {/* Tutorial */}
      {showTutorial && (
        <Tutorial 
          isOpen={showTutorial}
          onClose={closeTutorial}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}
