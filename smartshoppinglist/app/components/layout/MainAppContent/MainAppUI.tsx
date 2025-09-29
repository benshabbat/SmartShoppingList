/**
 * Main App UI Component
 * Zero Props Drilling - gets everything from context directly
 * Optimized with React.memo for better performance
 */

'use client'

import React from 'react'
import { Header } from '../Header'
import { MainShoppingView } from '../MainShoppingView'
import { ModalsContainer } from '../MainShoppingView/components/ModalsContainer'
import { ToastContainer } from '../../notifications/Toast'
import { Tutorial } from '../../ui/Tutorial'

import { GuestModeNotification } from '../../notifications/GuestModeNotification'
import { WelcomeMessage } from '../WelcomeMessage'
import { useMainAppLogic } from './useMainAppLogic'
import { LoadingOverlay } from '../../ui/LoadingOverlay'
import { LoginFormUI } from '../../forms/LoginForm/LoginFormUI'

export const MainAppUI = React.memo(() => {
  const { renderState, shouldShowGuestNotification } = useMainAppLogic()

  // Loading state
  if (renderState === 'loading') {
    return <LoadingOverlay isVisible={true} />
  }

  // Login state  
  if (renderState === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginFormUI/>
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
})

MainAppUI.displayName = 'MainAppUI'
