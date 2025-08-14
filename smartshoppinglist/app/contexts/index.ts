/**
 * Context exports - Zero Props Drilling Architecture
 */

// Main context
export { GlobalShoppingProvider, useGlobalShopping } from './GlobalShoppingContext'
export { 
  useShoppingData, 
  useShoppingActions, 
  useShoppingUI, 
  useShoppingComputed, 
  useShoppingAnalytics 
} from './GlobalShoppingContext'

// Enhanced hooks for specific use cases
export {
  useItemActions,
  useCartOperations,
  usePurchaseOperations,
  useModalOperations,
  useNotifications,
  useFormOperations
} from './EnhancedHooks'

// Logic hook (usually not imported directly)
export { useGlobalShoppingLogic } from './useGlobalShoppingLogic'
