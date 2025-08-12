/**
 * Main Store Index
 * Unified exports for all stores with clear organization
 */

// === CORE STORES ===
export { 
  useAuthStore, 
  useAuthSelectors 
} from './core/authStore'

// === UI STORES ===
export { 
  useUIStore, 
  useUISelectors,
  useSoundEnabled 
} from './ui/uiStore'

// === DATA STORES ===
export { 
  useShoppingDataStore, 
  useShoppingDataSelectors 
} from './data/shoppingDataStore'

export { 
  useAnalyticsStore, 
  useAnalyticsSelectors 
} from './data/analyticsStore'

// === STORE UTILITIES ===
export { create } from 'zustand'
export { devtools, persist, createJSONStorage } from 'zustand/middleware'
export { immer } from 'zustand/middleware/immer'

/**
 * Store Index - Clean exports only
 * For complex combinations, use the GlobalShoppingContext or stores directly in your components
 */
