/**
 * Global Shopping Context - Zero Props Drilling
 * All components can access this context directly without props
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useGlobalShoppingLogic } from './useGlobalShoppingLogic'
import type { ShoppingItem, ItemSuggestion, ExpiringItem, GlobalShoppingContextValue, GlobalShoppingProviderProps } from '../types'

const GlobalShoppingContext = createContext<GlobalShoppingContextValue | null>(null)

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
  const { addItem, toggleItemInCart, removeItem, clearPurchasedItems, clearCartItems } = useGlobalShopping()
  return { addItem, toggleItemInCart, removeItem, clearPurchasedItems, clearCartItems }
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
