import { usePathname } from 'next/navigation'
import { useUIStore } from '../../stores'
import { useAuth } from '../../hooks/useAuth'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { UserActionsHandler } from './utils'
import { ROUTES } from './constants'

/**
 * Custom hook for Header business logic
 * Single Responsibility: Manage header state and actions
 */
export const useHeaderLogic = () => {
  // Global context functions - NO PROPS DRILLING!
  const { openTutorial, openReceiptScanner } = useGlobalShopping()
  
  // UI state
  const soundEnabled = useUIStore((state) => state.soundEnabled)
  const toggleSound = useUIStore((state) => state.toggleSound)
  
  // Auth state
  const { user, signOut, isGuest } = useAuth()
  
  // Navigation state
  const pathname = usePathname()
  const isStatisticsPage = pathname === ROUTES.STATISTICS
  const isAuthenticated = !!user

  // Event handlers
  const handleSignOut = () => {
    signOut()
  }

  const handleSwitchToAuth = () => {
    UserActionsHandler.handleSwitchToAuth(signOut)
  }

  return {
    // State
    soundEnabled,
    user,
    isGuest,
    isStatisticsPage,
    isAuthenticated,
    
    // Actions
    openTutorial,
    openReceiptScanner,
    toggleSound,
    handleSignOut,
    handleSwitchToAuth,
  }
}
