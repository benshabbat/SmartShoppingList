import { useAuth } from '../../hooks/useAuth'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'

/**
 * Custom hook for MainShoppingView business logic
 * Single Responsibility: Manage main view state and data
 */
export const useMainShoppingViewLogic = () => {
  const { isGuest } = useAuth()
  
  // Get everything from global context - NO PROPS DRILLING!
  const globalShoppingData = useGlobalShopping()

  return {
    // Auth state
    isGuest,
    
    // Global shopping context (pass through)
    ...globalShoppingData,
  }
}
