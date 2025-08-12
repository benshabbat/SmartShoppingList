/**
 * Main App Content Container
 * Zero Props Drilling - UI components get everything from context
 */

'use client'

import { useEffect } from 'react'
import { useMainAppLogic } from './useMainAppLogic'
import { MainAppUI } from './MainAppUI'

export const MainAppContent = () => {
  const { initializeApp } = useMainAppLogic()

  // Initialize app on mount
  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  // No props passed to UI - everything from context!
  return <MainAppUI />
}
