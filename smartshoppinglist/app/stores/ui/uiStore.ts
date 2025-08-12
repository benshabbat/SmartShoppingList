/**
 * Unified UI Store
 * Combines and replaces both old uiStore and uiStateStore
 * Handles all UI state, modals, loading states, and user preferences
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ShoppingItem } from '../../types'

// Types
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface Modal {
  id: string
  type: 'expiryDate' | 'dataImport' | 'receiptScanner' | 'tutorial' | 'confirmation'
  data?: unknown
}

// UI State Interface
interface UIState {
  // === THEME & APPEARANCE ===
  theme: 'light' | 'dark' | 'system'
  
  // === NOTIFICATIONS ===
  toasts: Toast[]
  showGuestModeNotification: boolean
  
  // === MODALS ===
  activeModal: Modal | null
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  checkoutItems: ShoppingItem[]
  
  // === LOADING STATES ===
  globalLoading: boolean
  isAddingItem: boolean
  isUpdatingItem: boolean
  isDeletingItem: boolean
  
  // === GUEST MODE ===
  hasShownGuestExplanation: boolean
  
  // === USER PREFERENCES ===
  soundEnabled: boolean
  completedTutorialSteps: string[]
  sidebarOpen: boolean
  quickAddSuggestions: string[]
}

// UI Actions Interface
interface UIActions {
  // === THEME ACTIONS ===
  setTheme: (theme: UIState['theme']) => void
  toggleTheme: () => void
  
  // === TOAST ACTIONS ===
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  
  // === MODAL ACTIONS ===
  openModal: (modal: Modal) => void
  closeModal: () => void
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  
  // === LOADING ACTIONS ===
  setGlobalLoading: (loading: boolean) => void
  setAddingItem: (loading: boolean) => void
  setUpdatingItem: (loading: boolean) => void
  setDeletingItem: (loading: boolean) => void
  
  // === GUEST MODE ACTIONS ===
  shouldShowGuestExplanation: () => boolean
  dismissGuestExplanation: () => void
  setGuestModeNotification: (show: boolean) => void
  
  // === USER PREFERENCES ===
  setSoundEnabled: (enabled: boolean) => void
  toggleSound: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  addCompletedTutorialStep: (step: string) => void
  resetTutorial: () => void
  setQuickAddSuggestions: (suggestions: string[]) => void
  
  // === CHECKOUT ACTIONS ===
  setCheckoutItems: (items: ShoppingItem[]) => void
  clearCheckoutItems: () => void
  addToCheckout: (item: ShoppingItem) => void
  removeFromCheckout: (itemId: string) => void
  
  // === UTILITY ACTIONS ===
  reset: () => void
}

type UIStore = UIState & UIActions

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
  checkoutItems: [],
  
  // Loading States
  globalLoading: false,
  isAddingItem: false,
  isUpdatingItem: false,
  isDeletingItem: false,
  
  // Guest Mode
  hasShownGuestExplanation: false,
  
  // User Preferences
  soundEnabled: true,
  completedTutorialSteps: [],
  sidebarOpen: false,
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

// Selectors for better performance
export const useUISelectors = {
  theme: () => useUIStore((state) => state.theme),
  toasts: () => useUIStore((state) => state.toasts),
  modals: () => useUIStore((state) => ({
    activeModal: state.activeModal,
    showReceiptScanner: state.showReceiptScanner,
    showExpiryModal: state.showExpiryModal,
    showDataImportModal: state.showDataImportModal,
    showTutorial: state.showTutorial,
  })),
  loading: () => useUIStore((state) => ({
    globalLoading: state.globalLoading,
    isAddingItem: state.isAddingItem,
    isUpdatingItem: state.isUpdatingItem,
    isDeletingItem: state.isDeletingItem,
  })),
  preferences: () => useUIStore((state) => ({
    soundEnabled: state.soundEnabled,
    sidebarOpen: state.sidebarOpen,
    completedTutorialSteps: state.completedTutorialSteps,
  })),
  guestMode: () => useUIStore((state) => ({
    hasShownGuestExplanation: state.hasShownGuestExplanation,
    showGuestModeNotification: state.showGuestModeNotification,
  })),
  checkout: () => useUIStore((state) => state.checkoutItems),
}

// Convenience hooks for specific UI concerns
export const useSoundEnabled = () => useUIStore((state) => state.soundEnabled)
