/**
 * Unified UI Store
 * Combines and replaces both old uiStore and uiStateStore
 * Handles all UI state, modals, loading states, and user preferences
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { UIState, UIStore } from '../../types'

// Initial State
const initialState: UIState = {
  // Theme & Appearance
  theme: 'system',
  
  // Notifications
  toasts: [],
  showGuestModeNotification: false,
  
  // Modals
  activeModal: null,
  showReceiptScanner: false,
  showExpiryModal: false,
  showDataImportModal: false,
  showTutorial: false,
  showWelcomeMessage: false,
  welcomeUserName: null,
  checkoutItems: [],
  
  // Loading States
  globalLoading: false,
  isAddingItem: false,
  isUpdatingItem: false,
  isDeletingItem: false,
  
  // User Preferences
  soundEnabled: true,
  notificationsEnabled: true,
  autoCompleteEnabled: true,
  
  // Tutorial & Onboarding
  hasSeenWelcome: false,
  hasCompletedTutorial: false,
  currentTutorialStep: 0,
  
  // Animations & Transitions
  reduceMotion: false,
  animationDuration: 300,
  
  // Accessibility
  highContrast: false,
  fontSize: 'medium',
  
  // Keyboard Navigation
  keyboardNavigationEnabled: true,
  keyboardNavigation: true,
  focusVisible: true,
  
  // Layout & Display
  compactMode: false,
  showCategoryIcons: true,
  showItemImages: true,
  gridView: false,
  sidebarOpen: false,
  
  // Filtering & Search
  searchQuery: '',
  selectedCategory: null,
  showOnlyCartItems: false,
  showCompletedItems: true,
  
  // Guest Mode
  hasShownGuestExplanation: false,
  
  // Tutorial
  completedTutorialSteps: [],
  
  // Quick Add
  quickAddSuggestions: [],
}

// Store Implementation
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // === THEME ACTIONS ===
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
          }),

        toggleTheme: () =>
          set((state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark'
          }),

        // === TOAST ACTIONS ===
        addToast: (toast) =>
          set((state) => {
            const id = Date.now().toString()
            state.toasts.push({ ...toast, id })
          }),

        removeToast: (id) =>
          set((state) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== id)
          }),

        clearToasts: () =>
          set((state) => {
            state.toasts = []
          }),

        showSuccess: (message, duration = 4000) =>
          get().addToast({ message, type: 'success', duration }),

        showError: (message, duration = 6000) =>
          get().addToast({ message, type: 'error', duration }),

        showInfo: (message, duration = 4000) =>
          get().addToast({ message, type: 'info', duration }),

        showWarning: (message, duration = 5000) =>
          get().addToast({ message, type: 'warning', duration }),

        // === MODAL ACTIONS ===
        openModal: (modal) =>
          set((state) => {
            state.activeModal = modal
          }),

        closeModal: () =>
          set((state) => {
            state.activeModal = null
          }),

        openReceiptScanner: () =>
          set((state) => {
            state.showReceiptScanner = true
          }),

        closeReceiptScanner: () =>
          set((state) => {
            state.showReceiptScanner = false
          }),

        openExpiryModal: (items) =>
          set((state) => {
            state.showExpiryModal = true
            state.checkoutItems = items
          }),

        closeExpiryModal: () =>
          set((state) => {
            state.showExpiryModal = false
            state.checkoutItems = []
          }),

        openDataImportModal: () =>
          set((state) => {
            state.showDataImportModal = true
          }),

        closeDataImportModal: () =>
          set((state) => {
            state.showDataImportModal = false
          }),

        openTutorial: () =>
          set((state) => {
            state.showTutorial = true
          }),

        closeTutorial: () =>
          set((state) => {
            state.showTutorial = false
          }),

        showWelcome: (userName?: string) =>
          set((state) => {
            state.showWelcomeMessage = true
            state.welcomeUserName = userName || null
          }),

        closeWelcome: () =>
          set((state) => {
            state.showWelcomeMessage = false
            state.welcomeUserName = null
          }),

        // === LOADING ACTIONS ===
        setGlobalLoading: (loading) =>
          set((state) => {
            state.globalLoading = loading
          }),

        setAddingItem: (loading) =>
          set((state) => {
            state.isAddingItem = loading
          }),

        setUpdatingItem: (loading) =>
          set((state) => {
            state.isUpdatingItem = loading
          }),

        setDeletingItem: (loading) =>
          set((state) => {
            state.isDeletingItem = loading
          }),

        // === GUEST MODE ACTIONS ===
        shouldShowGuestExplanation: () => {
          const { hasShownGuestExplanation } = get()
          return !hasShownGuestExplanation
        },

        dismissGuestExplanation: () =>
          set((state) => {
            state.hasShownGuestExplanation = true
          }),

        setGuestModeNotification: (show) =>
          set((state) => {
            state.showGuestModeNotification = show
          }),

        // === USER PREFERENCES ===
        setSoundEnabled: (enabled) =>
          set((state) => {
            state.soundEnabled = enabled
          }),

        toggleSound: () =>
          set((state) => {
            state.soundEnabled = !state.soundEnabled
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen
          }),

        addCompletedTutorialStep: (step) =>
          set((state) => {
            if (!state.completedTutorialSteps.includes(step)) {
              state.completedTutorialSteps.push(step)
            }
          }),

        resetTutorial: () =>
          set((state) => {
            state.completedTutorialSteps = []
          }),

        setQuickAddSuggestions: (suggestions) =>
          set((state) => {
            state.quickAddSuggestions = suggestions
          }),

        // === CHECKOUT ACTIONS ===
        setCheckoutItems: (items) =>
          set((state) => {
            state.checkoutItems = items
          }),

        clearCheckoutItems: () =>
          set((state) => {
            state.checkoutItems = []
          }),

        addToCheckout: (item) =>
          set((state) => {
            if (!state.checkoutItems.find((i) => i.id === item.id)) {
              state.checkoutItems.push(item)
            }
          }),

        removeFromCheckout: (itemId) =>
          set((state) => {
            state.checkoutItems = state.checkoutItems.filter((i) => i.id !== itemId)
          }),

        // === UTILITY ACTIONS ===
        reset: () =>
          set((state) => {
            Object.assign(state, initialState)
          }),
      })),
      {
        name: 'ui-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          theme: state.theme,
          soundEnabled: state.soundEnabled,
          completedTutorialSteps: state.completedTutorialSteps,
          hasShownGuestExplanation: state.hasShownGuestExplanation,
          quickAddSuggestions: state.quickAddSuggestions,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)

// Selectors for better performance - These ARE React hooks
export const useUISelectors = {
  useTheme: () => useUIStore((state) => state.theme),
  useToasts: () => useUIStore((state) => state.toasts),
  useModals: () => useUIStore((state) => ({
    activeModal: state.activeModal,
    showReceiptScanner: state.showReceiptScanner,
    showExpiryModal: state.showExpiryModal,
    showDataImportModal: state.showDataImportModal,
    showTutorial: state.showTutorial,
    showWelcomeMessage: state.showWelcomeMessage,
    welcomeUserName: state.welcomeUserName,
  })),
  useLoading: () => useUIStore((state) => ({
    globalLoading: state.globalLoading,
    isAddingItem: state.isAddingItem,
    isUpdatingItem: state.isUpdatingItem,
    isDeletingItem: state.isDeletingItem,
  })),
  usePreferences: () => useUIStore((state) => ({
    soundEnabled: state.soundEnabled,
    sidebarOpen: state.sidebarOpen,
    completedTutorialSteps: state.completedTutorialSteps,
  })),
  useGuestMode: () => useUIStore((state) => ({
    hasShownGuestExplanation: state.hasShownGuestExplanation,
    showGuestModeNotification: state.showGuestModeNotification,
  })),
  useCheckout: () => useUIStore((state) => state.checkoutItems),
}

// Convenience hooks for specific UI concerns
export const useSoundEnabled = () => useUIStore((state) => state.soundEnabled)
