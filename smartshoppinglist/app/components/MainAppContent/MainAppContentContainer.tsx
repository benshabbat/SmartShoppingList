/**
 * Main App Content Container
 * Combines logic and UI with clean separation of concerns
 */

'use client'

import { useEffect } from 'react'
import { useMainAppLogic } from './useMainAppLogic'
import { MainAppUI } from './MainAppUI'

export const MainAppContent = () => {
  const {
    renderState,
    shouldShowGuestNotification,
    handleLoginSuccess,
    handleGuestDataImport,
    initializeApp
  } = useMainAppLogic()

  // Initialize app on mount
  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  return (
    <MainAppUI
      renderState={renderState}
      shouldShowGuestNotification={shouldShowGuestNotification}
      onLoginSuccess={handleLoginSuccess}
      onGuestDataImport={handleGuestDataImport}
    />
  )
}
