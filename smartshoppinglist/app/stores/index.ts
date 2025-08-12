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

// === COMBINED HOOKS FOR COMMON USE CASES ===

/**
 * Combined hook for all shopping-related data
 * Use this when you need both items and analytics
 */
export const useShoppingData = () => {
  // Import the stores directly here to avoid circular dependencies
  const { useShoppingDataStore } = require('./data/shoppingDataStore')
  const { useAnalyticsStore } = require('./data/analyticsStore')
  
  const shoppingData = useShoppingDataStore()
  const analytics = useAnalyticsStore()
  
  return {
    // Items data
    items: shoppingData.items,
    filteredItems: shoppingData.getFilteredItems(),
    itemsByStatus: shoppingData.getItemsByStatus(),
    suggestions: shoppingData.suggestions,
    expiringItems: shoppingData.expiringItems,
    purchaseHistory: shoppingData.purchaseHistory,
    pantryItems: shoppingData.pantryItems,
    
    // Analytics data
    smartSuggestions: analytics.smartSuggestions,
    popularItems: analytics.popularItems,
    categoryStats: analytics.categoryStats,
    
    // State
    loading: shoppingData.loading,
    error: shoppingData.error,
    isAnalyzing: analytics.isAnalyzing,
    
    // Actions
    loadItems: shoppingData.loadItems,
    addItem: shoppingData.addItem,
    updateItem: shoppingData.updateItem,
    deleteItem: shoppingData.deleteItem,
    toggleItemCart: shoppingData.toggleItemCart,
    refreshAnalytics: analytics.refreshAnalytics,
  }
}

/**
 * Combined hook for UI state management
 * Use this for all UI-related operations
 */
export const useUI = () => {
  const { useUIStore } = require('./ui/uiStore')
  const ui = useUIStore()
  
  return {
    // State
    theme: ui.theme,
    toasts: ui.toasts,
    loading: {
      global: ui.globalLoading,
      adding: ui.isAddingItem,
      updating: ui.isUpdatingItem,
      deleting: ui.isDeletingItem,
    },
    modals: {
      active: ui.activeModal,
      receiptScanner: ui.showReceiptScanner,
      expiryModal: ui.showExpiryModal,
      dataImport: ui.showDataImportModal,
      tutorial: ui.showTutorial,
    },
    preferences: {
      sound: ui.soundEnabled,
      sidebar: ui.sidebarOpen,
      tutorialSteps: ui.completedTutorialSteps,
    },
    guest: {
      hasShownExplanation: ui.hasShownGuestExplanation,
      showNotification: ui.showGuestModeNotification,
    },
    checkout: ui.checkoutItems,
    
    // Actions
    setTheme: ui.setTheme,
    toggleTheme: ui.toggleTheme,
    showSuccess: ui.showSuccess,
    showError: ui.showError,
    showInfo: ui.showInfo,
    showWarning: ui.showWarning,
    openModal: ui.openModal,
    closeModal: ui.closeModal,
    setLoading: {
      global: ui.setGlobalLoading,
      adding: ui.setAddingItem,
      updating: ui.setUpdatingItem,
      deleting: ui.setDeletingItem,
    },
    toggleSound: ui.toggleSound,
    toggleSidebar: ui.toggleSidebar,
  }
}

/**
 * Combined hook for authentication
 * Use this when you need auth state and operations
 */
export const useAppAuth = () => {
  const { useAuthStore } = require('./core/authStore')
  const auth = useAuthStore()
  
  return {
    // State
    user: auth.user,
    isLoading: auth.isLoading,
    isInitialized: auth.isInitialized,
    isAuthenticated: auth.isAuthenticated(),
    isGuestMode: auth.isGuestMode(),
    
    // Actions
    setUser: auth.setUser,
    setLoading: auth.setLoading,
    setInitialized: auth.setInitialized,
    logout: auth.logout,
    switchToGuestMode: auth.switchToGuestMode,
  }
}
