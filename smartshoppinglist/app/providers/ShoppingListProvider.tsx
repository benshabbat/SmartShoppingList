// Enhanced Shopping List Context with better state management
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useShoppingList, useItemOperations, useAnalytics } from '../hooks'
import { useToasts } from '../components/Toast'
import { useTutorial } from '../components/Tutorial'
import { useSoundManager } from '../utils/soundManager'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'

interface ShoppingListContextValue {
  // Data
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  expiringItems: ExpiringItem[]
  analytics: ReturnType<typeof useAnalytics>

  // Actions
  addItem: (itemName: string, category: string) => Promise<string | undefined>
  toggleItemInCart: (id: string) => void
  removeItem: (id: string) => void
  clearPurchased: () => void
  addSuggestedItem: (suggestionName: string) => Promise<void>
  updateItemWithExpiry: (id: string, expiry: Date) => void
  addItemsFromReceipt: (items: ShoppingItem[]) => void
  removeFromPantry: (id: string) => void
  setExpiringItems: React.Dispatch<React.SetStateAction<ExpiringItem[]>>
  importGuestData: () => void

  // UI Actions  
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  
  // Tutorial
  showTutorial: boolean
  closeTutorial: () => void
  openTutorial: () => void

  // Sound
  playAddToCart: () => void
  playRemoveFromCart: () => void
  playPurchase: () => void
  playDelete: () => void

  // Item Operations
  handleToggleCart: (id: string) => void
  handleRemoveItem: (id: string) => void
  handleClearPurchased: () => void
  handleClearCart: () => void
  handleCheckout: () => void
  handleCompletePurchase: (cartItems: ShoppingItem[]) => void
  getItemsByStatus: () => {
    pending: ShoppingItem[]
    inCart: ShoppingItem[]
    purchased: ShoppingItem[]
  }

  // Guest data
  hasGuestData: () => boolean
}

const ShoppingListContext = createContext<ShoppingListContextValue | null>(null)

interface ShoppingListProviderProps {
  children: ReactNode
}

export function ShoppingListProvider({ children }: ShoppingListProviderProps) {
  // Core shopping list functionality
  const {
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    expiringItems,
    addItem,
    toggleItemInCart,
    removeItem,
    clearPurchased,
    addSuggestedItem,
    updateItemWithExpiry,
    addItemsFromReceipt,
    removeFromPantry,
    setExpiringItems,
    importGuestData,
    hasGuestData
  } = useShoppingList()

  // Analytics
  const analytics = useAnalytics(purchaseHistory, pantryItems)

  // UI utilities
  const { showSuccess, showError, showInfo } = useToasts()
  const { showTutorial, closeTutorial, openTutorial } = useTutorial()
  const { playAddToCart, playRemoveFromCart, playPurchase, playDelete } = useSoundManager()

  // Item operations
  const {
    handleToggleCart,
    handleRemoveItem,
    handleClearPurchased,
    handleClearCart,
    handleCheckout,
    handleCompletePurchase,
    getItemsByStatus,
  } = useItemOperations({
    items,
    onToggleCart: toggleItemInCart,
    onRemoveItem: removeItem,
    onClearPurchased: clearPurchased,
    onUpdateItemWithExpiry: updateItemWithExpiry,
    onShowSuccess: (title: string, message: string) => showSuccess(`${title}: ${message}`),
    onShowError: (title: string, message: string) => showError(`${title}: ${message}`),
    onShowInfo: (title: string, message: string) => showInfo(`${title}: ${message}`),
    onPlaySound: (soundType) => {
      switch (soundType) {
        case 'addToCart': playAddToCart(); break;
        case 'removeFromCart': playRemoveFromCart(); break;
        case 'purchase': playPurchase(); break;
        case 'delete': playDelete(); break;
      }
    },
    onShowExpiryModal: () => {}, // Will be handled by individual components
  })

  const contextValue: ShoppingListContextValue = {
    // Data
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    expiringItems,
    analytics,

    // Actions
    addItem,
    toggleItemInCart,
    removeItem,
    clearPurchased,
    addSuggestedItem,
    updateItemWithExpiry,
    addItemsFromReceipt,
    removeFromPantry,
    setExpiringItems,
    importGuestData,

    // UI Actions
    showSuccess,
    showError,
    showInfo,

    // Tutorial
    showTutorial,
    closeTutorial,
    openTutorial,

    // Sound
    playAddToCart,
    playRemoveFromCart,
    playPurchase,
    playDelete,

    // Item Operations
    handleToggleCart,
    handleRemoveItem,
    handleClearPurchased,
    handleClearCart,
    handleCheckout,
    handleCompletePurchase,
    getItemsByStatus,

    // Guest data
    hasGuestData
  }

  return (
    <ShoppingListContext.Provider value={contextValue}>
      {children}
    </ShoppingListContext.Provider>
  )
}

export function useShoppingListContext() {
  const context = useContext(ShoppingListContext)
  if (!context) {
    throw new Error('useShoppingListContext must be used within a ShoppingListProvider')
  }
  return context
}
