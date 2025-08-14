/**
 * Main App UI Component
 * Zero Props Drilling - gets everything from context directly
 */

'use client'

import { Header } from '../Header'
import { LoginForm } from '../LoginForm'
import { MainShoppingView } from '../MainShoppingView'
import { ModalsContainer } from '../MainShoppingView/components/ModalsContainer'
import { ToastContainer } from '../Toast'
import { Tutorial } from '../Tutorial'

import { GuestModeNotification } from '../GuestModeNotification'
import { WelcomeMessage } from '../WelcomeMessage'
import { useMainAppLogic } from './useMainAppLogic'
import { LoadingOverlay } from '../LoadingOverlay'

export const MainAppUI = () => {
  const { renderState, shouldShowGuestNotification } = useMainAppLogic()

  // Loading state
  if (renderState === 'loading') {
    return <LoadingOverlay />
  }

  // Login state  
  if (renderState === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm />
      </div>
    )
  }

  // Main app state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header />

      {/* Guest Mode Notification - No props needed! */}
      {shouldShowGuestNotification && <GuestModeNotification />}

      {/* Welcome Message - Zero Props Drilling */}
      <WelcomeMessage />

      {/* Main Content */}
      <MainShoppingView />

      {/* Modals - Zero Props Drilling */}
      <ModalsContainer />

      {/* Tutorial */}
      <Tutorial />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}
