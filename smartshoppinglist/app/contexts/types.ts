/**
 * Type definitions for Global Shopping Logic
 * עוזר ל-TypeScript להבין את הטיפוסים
 */

import { ShoppingItem } from '../types'

// Extended Shopping Item with computed properties
export interface ComputedShoppingItem extends ShoppingItem {
  daysSinceAdded?: number
  isExpiringSoon?: boolean
  isPriority?: boolean
}

// Shopping Analytics Interface
export interface ShoppingAnalytics {
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: ShoppingItem[]
  priorityItems: ShoppingItem[]
}

// Shopping State Interface
export interface ShoppingState {
  pendingItems: ShoppingItem[]
  cartItems: ShoppingItem[]
  purchasedItems: ShoppingItem[]
  hasItemsInCart: boolean
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
}

// Enhanced Global Shopping Context Type
export interface EnhancedGlobalShoppingContextValue extends ShoppingState, ShoppingAnalytics {
  // === DATA ACCESS ===
  items: ShoppingItem[]
  suggestions: any[]
  expiringItems: any[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
  
  // === UI STATE ===
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  checkoutItems: ShoppingItem[]
  
  // === CORE ACTIONS ===
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  
  // === UI ACTIONS ===
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  
  // === COMPLEX OPERATIONS ===
  handleCheckout: () => void
  createQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  addBulkToCart: (items: Array<{name: string, category: string}>) => Promise<void>
  processReceipt: (receiptItems: ShoppingItem[], storeName: string) => void
  submitExpiryModal: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  
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

// Hook Return Types
export interface UseShoppingDataReturn {
  items: ShoppingItem[]
  suggestions: any[]
  expiringItems: any[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: ShoppingItem[]
}

export interface UseShoppingActionsReturn {
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
}

export interface UseShoppingComputedReturn extends ShoppingState {
  priorityItems: ShoppingItem[]
  completionRate: number
  categoryStats: Record<string, number>
}

export interface UseShoppingAnalyticsReturn extends ShoppingAnalytics {
  purchaseHistory: ShoppingItem[]
}
