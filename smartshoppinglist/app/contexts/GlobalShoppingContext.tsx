/**
 * Global Shopping Context - Zero Props Drilling
 * All components can access this context directly without props
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useGlobalShoppingLogic } from './useGlobalShoppingLogic'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'

// Context value type - all the functions and data components might need
interface GlobalShoppingContextValue {
  // === DATA ACCESS (no props needed) ===
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
  
  // === UI STATE (no props needed) ===
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  checkoutItems: ShoppingItem[]
  
  // === CORE ACTIONS (no props needed) ===
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  
  // === UI ACTIONS (no props needed) ===
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  
  // === COMPLEX OPERATIONS (no props needed) ===
  handleCheckout: () => void
  createQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  addBulkToCart: (items: Array<{name: string, category: string}>) => Promise<void>
  processReceipt: (receiptItems: ShoppingItem[], storeName: string) => void
  submitExpiryModal: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  
  // === COMPUTED VALUES (no props needed) ===
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
  
  // === GUEST MODE (no props needed) ===
  shouldShowGuestExplanation: boolean
  dismissGuestExplanation: () => void
  
  // === NOTIFICATIONS (no props needed) ===
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  
  // === SOUNDS (no props needed) ===
  playAddToCart: () => void
  playRemoveFromCart: () => void
  playPurchase: () => void
  playDelete: () => void
}

const GlobalShoppingContext = createContext<GlobalShoppingContextValue | null>(null)

interface GlobalShoppingProviderProps {
  children: ReactNode
}

export const GlobalShoppingProvider = ({ children }: GlobalShoppingProviderProps) => {
  const contextValue = useGlobalShoppingLogic()
  
  return (
    <GlobalShoppingContext.Provider value={contextValue}>
      {children}
    </GlobalShoppingContext.Provider>
  )
}

// Hook for components to use - no props drilling needed!
export const useGlobalShopping = () => {
  const context = useContext(GlobalShoppingContext)
  if (!context) {
    throw new Error('useGlobalShopping must be used within GlobalShoppingProvider')
  }
  return context
}

// Optional: Specific hooks for different concerns (cleaner API)
export const useShoppingData = () => {
  const { 
    items, suggestions, expiringItems, purchaseHistory, pantryItems, loading, error,
    totalItems, completionRate, categoryStats, recentlyAdded 
  } = useGlobalShopping()
  return { 
    items, suggestions, expiringItems, purchaseHistory, pantryItems, loading, error,
    totalItems, completionRate, categoryStats, recentlyAdded 
  }
}

export const useShoppingActions = () => {
  const { addItem, toggleItemInCart, removeItem, clearPurchasedItems } = useGlobalShopping()
  return { addItem, toggleItemInCart, removeItem, clearPurchasedItems }
}

export const useShoppingUI = () => {
  const { 
    showReceiptScanner, showExpiryModal, showDataImportModal, showTutorial,
    openReceiptScanner, closeReceiptScanner, openExpiryModal, closeExpiryModal,
    openDataImportModal, closeDataImportModal, openTutorial, closeTutorial
  } = useGlobalShopping()
  return {
    showReceiptScanner, showExpiryModal, showDataImportModal, showTutorial,
    openReceiptScanner, closeReceiptScanner, openExpiryModal, closeExpiryModal,
    openDataImportModal, closeDataImportModal, openTutorial, closeTutorial
  }
}

export const useShoppingComputed = () => {
  const { 
    pendingItems, cartItems, purchasedItems, hasItemsInCart, 
    hasExpiringItems, hasPurchaseHistory, isPantryEmpty,
    priorityItems, completionRate, categoryStats 
  } = useGlobalShopping()
  return { 
    pendingItems, cartItems, purchasedItems, hasItemsInCart, 
    hasExpiringItems, hasPurchaseHistory, isPantryEmpty,
    priorityItems, completionRate, categoryStats 
  }
}

export const useShoppingAnalytics = () => {
  const { 
    totalItems, completionRate, categoryStats, recentlyAdded, 
    priorityItems, purchaseHistory 
  } = useGlobalShopping()
  return { 
    totalItems, completionRate, categoryStats, recentlyAdded, 
    priorityItems, purchaseHistory 
  }
}
