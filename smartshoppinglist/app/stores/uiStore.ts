import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// UI Store Types
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

interface UIState {
  // Theme and appearance
  theme: 'light' | 'dark' | 'system'
  
  // Notifications
  toasts: Toast[]
  
  // Modals
  activeModal: Modal | null
  
  // Loading states
  globalLoading: boolean
  
  // Tutorial and onboarding
  showTutorial: boolean
  completedTutorialSteps: string[]
  
  // Sidebar and navigation
  sidebarOpen: boolean
  
  // Quick add suggestions
  quickAddSuggestions: string[]
  
  // Sound preferences
  soundEnabled: boolean
  
  // Guest mode notifications
  showGuestModeNotification: boolean
}

interface UIActions {
  // Theme
  setTheme: (theme: UIState['theme']) => void
  
  // Toast management
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Modal management
  openModal: (modal: Modal) => void
  closeModal: () => void
  
  // Loading
  setGlobalLoading: (loading: boolean) => void
  
  // Tutorial
  setShowTutorial: (show: boolean) => void
  markTutorialStepCompleted: (step: string) => void
  resetTutorial: () => void
  
  // Sidebar
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Quick add suggestions
  setQuickAddSuggestions: (suggestions: string[]) => void
  addQuickAddSuggestion: (suggestion: string) => void
  removeQuickAddSuggestion: (suggestion: string) => void
  
  // Sound
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
  
  // Guest mode
  setShowGuestModeNotification: (show: boolean) => void
}

type UIStore = UIState & UIActions

const initialState: UIState = {
  theme: 'system',
  toasts: [],
  activeModal: null,
  globalLoading: false,
  showTutorial: false,
  completedTutorialSteps: [],
  sidebarOpen: false,
  quickAddSuggestions: [],
  soundEnabled: true,
  showGuestModeNotification: false,
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // Theme
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
          }),

        // Toast management
        addToast: (toast) =>
          set((state) => {
            const id = Math.random().toString(36).substring(2, 9)
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

        // Modal management
        openModal: (modal) =>
          set((state) => {
            state.activeModal = modal
          }),

        closeModal: () =>
          set((state) => {
            state.activeModal = null
          }),

        // Loading
        setGlobalLoading: (loading) =>
          set((state) => {
            state.globalLoading = loading
          }),

        // Tutorial
        setShowTutorial: (show) =>
          set((state) => {
            state.showTutorial = show
          }),

        markTutorialStepCompleted: (step) =>
          set((state) => {
            if (!state.completedTutorialSteps.includes(step)) {
              state.completedTutorialSteps.push(step)
            }
          }),

        resetTutorial: () =>
          set((state) => {
            state.completedTutorialSteps = []
            state.showTutorial = false
          }),

        // Sidebar
        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open
          }),

        // Quick add suggestions
        setQuickAddSuggestions: (suggestions) =>
          set((state) => {
            state.quickAddSuggestions = suggestions
          }),

        addQuickAddSuggestion: (suggestion) =>
          set((state) => {
            if (!state.quickAddSuggestions.includes(suggestion)) {
              state.quickAddSuggestions.push(suggestion)
            }
          }),

        removeQuickAddSuggestion: (suggestion) =>
          set((state) => {
            state.quickAddSuggestions = state.quickAddSuggestions.filter(
              (s) => s !== suggestion
            )
          }),

        // Sound
        toggleSound: () =>
          set((state) => {
            state.soundEnabled = !state.soundEnabled
          }),

        setSoundEnabled: (enabled) =>
          set((state) => {
            state.soundEnabled = enabled
          }),

        // Guest mode
        setShowGuestModeNotification: (show) =>
          set((state) => {
            state.showGuestModeNotification = show
          }),
      })),
      {
        name: 'ui-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          theme: state.theme,
          completedTutorialSteps: state.completedTutorialSteps,
          quickAddSuggestions: state.quickAddSuggestions,
          soundEnabled: state.soundEnabled,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)

// Selector hooks for optimized re-renders
export const useTheme = () => useUIStore((state) => state.theme)
export const useToasts = () => useUIStore((state) => state.toasts)
export const useActiveModal = () => useUIStore((state) => state.activeModal)
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading)
export const useSoundEnabled = () => useUIStore((state) => state.soundEnabled)
