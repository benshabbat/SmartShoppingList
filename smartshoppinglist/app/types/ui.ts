/**
 * UI Types - User Interface Components and State
 * Contains all types related to UI components, modals, toasts, and UI state management
 */

// Toast types
export interface Toast {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

// Modal types
export interface Modal {
  id: string
  type: 'expiryDate' | 'dataImport' | 'receiptScanner' | 'tutorial' | 'confirmation'
  data?: unknown
}

// UI State Interface
export interface UIState {
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
  showWelcomeMessage: boolean
  welcomeUserName: string | null
  checkoutItems: any[] // ShoppingItem[] - will be imported from main types
  
  // === LOADING STATES ===
  globalLoading: boolean
  isAddingItem: boolean
  isUpdatingItem: boolean
  isDeletingItem: boolean
  
  // === USER PREFERENCES ===
  soundEnabled: boolean
  notificationsEnabled: boolean
  autoCompleteEnabled: boolean
  
  // === TUTORIAL & ONBOARDING ===
  hasSeenWelcome: boolean
  hasCompletedTutorial: boolean
  currentTutorialStep: number
  
  // === ANIMATIONS & TRANSITIONS ===
  reduceMotion: boolean
  animationDuration: number
  
  // === ACCESSIBILITY ===
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  
  // === KEYBOARD NAVIGATION ===
  keyboardNavigationEnabled: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
  
  // === LAYOUT & DISPLAY ===
  compactMode: boolean
  showCategoryIcons: boolean
  showItemImages: boolean
  gridView: boolean
  sidebarOpen: boolean
  
  // === FILTERING & SEARCH ===
  searchQuery: string
  selectedCategory: string | null
  showOnlyCartItems: boolean
  showCompletedItems: boolean
  
  // === GUEST MODE ===
  hasShownGuestExplanation: boolean
  
  // === TUTORIAL ===
  completedTutorialSteps: string[]
  
  // === QUICK ADD ===
  quickAddSuggestions: any[]
}

// UI Actions Interface
export interface UIActions {
  // === THEME ===
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // === TOAST MANAGEMENT ===
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // === MODAL MANAGEMENT ===
  openModal: (modal: Omit<Modal, 'id'>) => void
  closeModal: () => void
  closeModalById: (id: string) => void
  
  // Specific modal helpers
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: any[]) => void // ShoppingItem[]
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  showWelcome: (userName?: string) => void
  closeWelcome: () => void
  
  // === LOADING STATES ===
  setGlobalLoading: (loading: boolean) => void
  setAddingItem: (loading: boolean) => void
  setUpdatingItem: (loading: boolean) => void
  setDeletingItem: (loading: boolean) => void
  
  // === USER PREFERENCES ===
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
  toggleNotifications: () => void
  setNotificationsEnabled: (enabled: boolean) => void
  toggleAutoComplete: () => void
  setAutoCompleteEnabled: (enabled: boolean) => void
  
  // === TUTORIAL & ONBOARDING ===
  markWelcomeSeen: () => void
  markTutorialCompleted: () => void
  setTutorialStep: (step: number) => void
  resetTutorial: () => void
  
  // === ANIMATIONS & TRANSITIONS ===
  setReduceMotion: (reduce: boolean) => void
  setAnimationDuration: (duration: number) => void
  
  // === ACCESSIBILITY ===
  setHighContrast: (enabled: boolean) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  
  // === KEYBOARD NAVIGATION ===
  setKeyboardNavigation: (enabled: boolean) => void
  setFocusVisible: (visible: boolean) => void
  
  // === LAYOUT & DISPLAY ===
  toggleCompactMode: () => void
  setCompactMode: (compact: boolean) => void
  toggleCategoryIcons: () => void
  setCategoryIcons: (show: boolean) => void
  toggleItemImages: () => void
  setItemImages: (show: boolean) => void
  toggleGridView: () => void
  setGridView: (grid: boolean) => void
  
  // === FILTERING & SEARCH ===
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  toggleCartItemsOnly: () => void
  setShowOnlyCartItems: (show: boolean) => void
  toggleCompletedItems: () => void
  setShowCompletedItems: (show: boolean) => void
  
  // === GUEST MODE ===
  showGuestNotification: () => void
  hideGuestNotification: () => void
  shouldShowGuestExplanation: () => boolean
  dismissGuestExplanation: () => void
  setGuestModeNotification: (show: boolean) => void
  
  // === SIDEBAR ===
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  
  // === TUTORIAL ===
  addCompletedTutorialStep: (step: string) => void
  resetCompletedTutorialSteps: () => void
  
  // === QUICK ADD ===
  setQuickAddSuggestions: (suggestions: any[]) => void
  
  // === CHECKOUT ===
  setCheckoutItems: (items: any[]) => void
  addToCheckout: (item: any) => void
  removeFromCheckout: (itemId: string) => void
  clearCheckout: () => void
  
  // === UTILITY ===
  resetUIState: () => void
}

export type UIStore = UIState & UIActions
