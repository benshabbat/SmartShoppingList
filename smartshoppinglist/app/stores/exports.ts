/**
 * Modern Store Exports
 * Clean, organized exports for the new store architecture
 */

// === MAIN CONTEXT (Recommended for most components) ===
export { 
  GlobalShoppingProvider,
  useGlobalShopping
} from '../contexts/GlobalShoppingContext'

// === INDIVIDUAL STORES (For specialized use cases) ===
export {
  useAuthStore,
  useUIStore,
  useShoppingDataStore,
  useAnalyticsStore
} from './index'

// === STORE SELECTORS (For performance optimization) ===
export {
  useAuthSelectors,
  useUISelectors,
  useAnalyticsSelectors
} from './index'

// === LEGACY SUPPORT (Gradually remove these) ===
// Keep these exports temporarily for existing components
export { useAuthStore as useAuth } from './core/authStore'
export { useUIStore as useUIState } from './ui/uiStore'
