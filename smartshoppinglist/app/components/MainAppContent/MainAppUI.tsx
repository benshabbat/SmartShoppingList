/**
 * Main App UI Component
 * Pure presentational component for the main app layout
 */

import { ReactNode } from 'react'
import { Header } from '../Header'
import { LoginForm } from '../LoginForm'
import { MainShoppingView } from '../MainShoppingView'
import { ToastContainer } from '../Toast'
import { Tutorial } from '../Tutorial'
import { LoadingOverlay } from '../LoadingOverlay'
import { GuestModeNotification } from '../GuestModeNotification'

interface MainAppUIProps {
  // Render state
  renderState: 'loading' | 'login' | 'main'
  
  // Guest notification
  shouldShowGuestNotification: boolean
  
  // Event handlers
  onLoginSuccess: () => void
  onGuestDataImport: () => void
}

export const MainAppUI = ({
  renderState,
  shouldShowGuestNotification,
  onLoginSuccess,
  onGuestDataImport
}: MainAppUIProps) => {
  // Loading state
  if (renderState === 'loading') {
    return <LoadingOverlay message="טוען..." />
  }

  // Login state
  if (renderState === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm onSuccess={onLoginSuccess} />
      </div>
    )
  }

  // Main app state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header />

      {/* Guest Mode Notification */}
      {shouldShowGuestNotification && (
        <GuestModeNotification
          onDismiss={onGuestDataImport}
        />
      )}

      {/* Main Content */}
      <MainShoppingView />

      {/* Tutorial */}
      <Tutorial />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}
