/**
 * Modern Store Exports
 * Clean, organized exports for the new store architecture
 */

// === MAIN CONTEXT (Recommended for most components) ===
export { 
  GlobalAppProvider,
  useGlobalApp,
  useAppData,
  useAppActions,
  useAppUI,
  useAppAuth as useContextAuth
} from '../contexts/GlobalAppContext'

// === INDIVIDUAL STORES (For specialized use cases) ===
export {
  useAuthStore,
  useUIStore,
  useShoppingDataStore,
  useAnalyticsStore,
  useAppAuth,
  useUI,
  useShoppingData
} from './index'

// === STORE SELECTORS (For performance optimization) ===
export {
  useAuthSelectors,
  useUISelectors,
  useShoppingDataSelectors,
  useAnalyticsSelectors
} from './index'

// === LEGACY SUPPORT (Gradually remove these) ===
// Keep these exports temporarily for existing components
export { useAuthStore as useAuth } from './core/authStore'
export { useUIStore as useUIState } from './ui/uiStore'
