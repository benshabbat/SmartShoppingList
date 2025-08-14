/**
 * Context Types - React Context and Global State Management
 * Contains all types related to React contexts, global state, and shopping logic
 */

import { User as SupabaseUser, Session } from '@supabase/supabase-js'

// === USER & AUTHENTICATION TYPES ===

export interface User {
  email?: string
  id?: string
  name?: string
}

export interface AuthContextType {
  user: SupabaseUser | null
  session: Session | null | undefined
  loading: boolean
  isGuest: boolean
  signOut: () => Promise<void>
  signInAsGuest: () => void
  switchToAuth: () => void
  isAuthenticated: boolean
}

// === HEADER TYPES ===

export interface HeaderState {
  soundEnabled: boolean
  user: User | null
  isGuest: boolean
  isStatisticsPage: boolean
  isAuthenticated: boolean
}

export interface HeaderActions {
  openTutorial: () => void
  openReceiptScanner: () => void
  toggleSound: () => void
  handleSignOut: () => void
  handleSwitchToAuth: () => void
}

// === SHOPPING UI TYPES ===

export interface ShoppingUIState {
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  showWelcomeMessage: boolean
  welcomeUserName: string | null
  checkoutItems: any[] // Forward reference to avoid circular imports
}

export interface ShoppingUIActions {
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: any[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  showWelcome: (userName?: string) => void
  closeWelcome: () => void
}

// === SHOPPING OPERATIONS TYPES ===

export interface ShoppingComplexOperations {
  handleCheckout: () => void
  createQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  addBulkToCart: (items: Array<{name: string, category: string}>) => Promise<void>
  processReceipt: (receiptItems: any[], storeName: string) => void
  submitExpiryModal: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
}

export interface ShoppingNotifications {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

export interface ShoppingSounds {
  playAddToCart: () => void
  playRemoveFromCart: () => void
  playPurchase: () => void
  playDelete: () => void
}

export interface ShoppingGuestMode {
  shouldShowGuestExplanation: boolean
  dismissGuestExplanation: () => void
}

// === MAIN CONTEXT INTERFACE ===

export interface GlobalShoppingContextValue {
  // === DATA ACCESS ===
  items: any[] // ShoppingItem[] - imported from data.ts
  suggestions: any[] // ItemSuggestion[]
  expiringItems: any[] // ExpiringItem[]
  purchaseHistory: any[] // ShoppingItem[]
  pantryItems: any[] // ShoppingItem[]
  loading: boolean
  error: string | null
  
  // === UI STATE ===
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  showWelcomeMessage: boolean
  welcomeUserName: string | null
  checkoutItems: any[] // ShoppingItem[]
  
  // === CORE ACTIONS ===
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  clearCartItems: () => Promise<void>
  
  // === UI ACTIONS ===
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
  
  // === COMPLEX OPERATIONS ===
  handleCheckout: () => void
  createQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  addBulkToCart: (items: Array<{name: string, category: string}>) => Promise<void>
  processReceipt: (receiptItems: any[], storeName: string) => void // ShoppingItem[]
  submitExpiryModal: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  
  // === COMPUTED VALUES ===
  pendingItems: any[] // ShoppingItem[]
  cartItems: any[] // ShoppingItem[]
  purchasedItems: any[] // ShoppingItem[]
  hasItemsInCart: boolean
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
  
  // === ENHANCED COMPUTED VALUES ===
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: any[] // ShoppingItem[]
  priorityItems: any[] // ShoppingItem[]
  
  // === GUEST MODE ===
  shouldShowGuestExplanation: boolean
  dismissGuestExplanation: () => void
  
  // === NOTIFICATIONS ===
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  
  // === SOUNDS ===
  playAddToCart: () => void
  playRemoveFromCart: () => void
  playPurchase: () => void
  playDelete: () => void
}

export interface GlobalShoppingProviderProps {
  children: React.ReactNode
}

// Enhanced version with all computed values
export interface EnhancedGlobalShoppingContextValue extends GlobalShoppingContextValue {
  // All the enhanced features are already included in GlobalShoppingContextValue
}
