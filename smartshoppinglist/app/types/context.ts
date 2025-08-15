/**
 * Context Types - React Context and Global State Management
 * Contains all types related to React contexts, global state, and shopping logic
 */

import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { ShoppingItem, ItemSuggestion, ExpiringItem } from './data'

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
  checkoutItems: ShoppingItem[]
}

export interface ShoppingUIActions {
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
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
  processReceipt: (receiptItems: ShoppingItem[], storeName: string) => void
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
  items: ShoppingItem[] // imported from data.ts
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
  
  // === UI STATE ===
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  showWelcomeMessage: boolean
  welcomeUserName: string | null
  checkoutItems: ShoppingItem[]
  
  // === CORE ACTIONS ===
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  clearCartItems: () => Promise<void>
  
  // === ADD ITEM FORM STATE ===
  itemName: {
    value: string
    isValid: boolean
    error?: string
    onChange: (value: string) => void
    reset: () => void
  }
  newItemCategory: string
  setNewItemCategory: (category: string) => void
  smartSuggestions: string[]
  autoChangedCategory: boolean
  showCategorySuggestion: boolean
  suggestedCategory: string | null
  
  // === ADD ITEM FORM ACTIONS ===
  handleAddItemSubmit: (e: React.FormEvent) => Promise<void>
  handleAutoCompleteSelect: (selectedItem: string) => Promise<void>
  handleCategorySuggestionAccept: () => void
  handleCategorySuggestionDismiss: () => void
  
  // === UI ACTIONS ===
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
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
  processReceipt: (receiptItems: ShoppingItem[], storeName: string) => void
  submitExpiryModal: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  
  // === COMPUTED VALUES ===
  pendingItems: ShoppingItem[]
  cartItems: ShoppingItem[]
  purchasedItems: ShoppingItem[]
  hasItemsInCart: boolean
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
  
  // === ENHANCED COMPUTED VALUES ===
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: ShoppingItem[]
  priorityItems: ShoppingItem[]
  
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

// Enhanced version with all computed values - using Record instead of empty interface
export type EnhancedGlobalShoppingContextValue = GlobalShoppingContextValue
