/**
 * Main App Logic Hook
 * Handles all business logic for the main app content
 */

import { useCallback, useMemo } from 'react'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { useAuth } from '../../hooks/useAuth'

export const useMainAppLogic = () => {
  const { loading, user, isGuest } = useAuth()
  const {
    showTutorial,
    openDataImportModal,
    showSuccess,
    items: _items,
    shouldShowGuestExplanation
  } = useGlobalShopping()

  // Computed values
  const isAuthenticated = useMemo(() => !!user, [user])
  
  const appState = useMemo(() => ({
    isLoading: loading,
    isAuthenticated,
    isGuest,
    showTutorial
  }), [loading, isAuthenticated, isGuest, showTutorial])

  // Guest data detection logic
  const hasGuestData = useCallback(() => {
    // Check if there are items in localStorage or session storage
    if (typeof window === 'undefined') return false
    
    try {
      const guestItems = localStorage.getItem('guestShoppingItems')
      const guestData = guestItems ? JSON.parse(guestItems) : null
      return Array.isArray(guestData) && guestData.length > 0
    } catch (error) {
      console.error('Error checking guest data:', error)
      return false
    }
  }, [])

  // Guest data import logic
  const handleGuestDataImport = useCallback(() => {
    if (!hasGuestData()) {
      showSuccess('אין נתוני אורח לייבוא')
      return
    }

    try {
      // In the future, this will trigger the data import modal
      // For now, just show a success message
      showSuccess('ייבוא נתוני אורח יתווסף בעתיד')
      
      // Clear guest data after import
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guestShoppingItems')
      }
    } catch (error) {
      console.error('Error importing guest data:', error)
      showSuccess('שגיאה בייבוא נתוני אורח')
    }
  }, [hasGuestData, showSuccess])

  // Login success handler
  const handleLoginSuccess = useCallback(() => {
    // Check if there's guest data to import after successful login
    if (hasGuestData()) {
      openDataImportModal()
    } else {
      showSuccess('התחברת בהצלחה!')
    }
  }, [hasGuestData, openDataImportModal, showSuccess])

  // Handle app errors
  const handleAppError = useCallback((error: Error) => {
    console.error('App error:', error)
    showSuccess('אירעה שגיאה באפליקציה')
  }, [showSuccess])

  // Check if we should show guest notification
  const shouldShowGuestNotification = useMemo(() => {
    return isGuest && hasGuestData() && shouldShowGuestExplanation
  }, [isGuest, hasGuestData, shouldShowGuestExplanation])

  // Render state determination
  const renderState = useMemo((): 'loading' | 'login' | 'main' => {
    if (loading) return 'loading'
    if (!isAuthenticated && !isGuest) return 'login'
    return 'main'
  }, [loading, isAuthenticated, isGuest])

  return {
    // State
    appState,
    renderState,
    shouldShowGuestNotification,
    
    // Computed values
    isAuthenticated,
    isGuest,
    hasGuestData: hasGuestData(),
    
    // Event handlers
    handleGuestDataImport,
    handleLoginSuccess,
    handleAppError,
    
    // Utilities
    user
  }
}
