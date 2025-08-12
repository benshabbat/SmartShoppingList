/**
 * Shopping List Display Context
 * Handles only UI logic and display operations
 * Uses stores for data management
 */

'use client'

import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useShoppingItemsStore } from '../stores/shoppingItemsStore'
import { useUIStore } from '../stores/uiStateStore'
import { useAuth } from '../hooks/useAuth'
import { useToasts } from '../components/Toast'
import { useSoundManager } from '../utils/soundManager'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'
import { MESSAGES } from '../utils/appConstants'

interface ShoppingListDisplayContextValue {
  // Data from stores (read-only for UI)
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
  
  // UI State
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  checkoutItems: ShoppingItem[]
  
  // Display Logic Functions (no DB operations)
  handleAddItem: (itemName: string, category: string) => Promise<void>
  handleToggleCart: (id: string) => Promise<void>
  handleRemoveItem: (id: string) => Promise<void>
  handleClearPurchased: () => Promise<void>
  
  // UI Actions
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  
  // Complex UI Operations
  handleCheckout: () => void
  handleCreateQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  handleReceiptProcessed: (receiptItems: ShoppingItem[], storeName: string) => void
  handleExpiryModalSubmit: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  
  // Helper Functions for Display
  getItemsByStatus: () => {
    pending: ShoppingItem[]
    inCart: ShoppingItem[]
    purchased: ShoppingItem[]
  }
  hasItemsInCart: boolean
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
  
  // Guest Mode UI Logic
  shouldShowGuestExplanation: () => boolean
  dismissGuestExplanation: () => void
  
  // Notifications (UI feedback)
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

const ShoppingListDisplayContext = createContext<ShoppingListDisplayContextValue | null>(null)

interface ShoppingListDisplayProviderProps {
  children: ReactNode
}

export const ShoppingListDisplayProvider = ({ children }: ShoppingListDisplayProviderProps) => {
  const { user, isGuest } = useAuth()
  const { showSuccess, showError, showInfo } = useToasts()
  const { playAddToCart, playRemoveFromCart, playPurchase, playDelete } = useSoundManager()
  
  // Store hooks
  const {
    items,
    suggestions,
    expiringItems,
    purchaseHistory,
    pantryItems,
    loading,
    error,
    loadItems,
    addItem,
    toggleItemCart,
    deleteItem,
    clearPurchasedItems,
    getItemsByStatus,
    hasItemsInCart,
    hasExpiringItems,
    hasPurchaseHistory,
    isPantryEmpty,
  } = useShoppingItemsStore()
  
  const {
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
    showTutorial,
    checkoutItems,
    openReceiptScanner,
    closeReceiptScanner,
    openExpiryModal,
    closeExpiryModal,
    openDataImportModal,
    closeDataImportModal,
    openTutorial,
    closeTutorial,
    shouldShowGuestExplanation,
    dismissGuestExplanation,
    setCheckoutItems,
    clearCheckoutItems,
  } = useUIStore()
  
  // Load items on mount
  useEffect(() => {
    loadItems(user?.id)
  }, [user?.id, loadItems])
  
  // Display Logic Functions (wrapper around store operations with UI feedback)
  const handleAddItem = async (itemName: string, category: string) => {
    try {
      await addItem(itemName, category, user?.id)
      showSuccess(`הפריט "${itemName}" נוסף לרשימה`)
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('שגיאה בהוספת הפריט')
      }
    }
  }
  
  const handleToggleCart = async (id: string) => {
    try {
      const item = items.find(i => i.id === id)
      if (!item) return
      
      await toggleItemCart(id, user?.id)
      
      if (item.isInCart) {
        playRemoveFromCart()
        showInfo(`${item.name} הוסר מהסל`)
      } else {
        playAddToCart()
        showSuccess(`${item.name} נוסף לסל`)
      }
    } catch (error) {
      showError('שגיאה בעדכון הפריט')
    }
  }
  
  const handleRemoveItem = async (id: string) => {
    try {
      const item = items.find(i => i.id === id)
      if (!item) return
      
      await deleteItem(id, user?.id)
      playDelete()
      showError(`${item.name} הוסר מהרשימה`)
    } catch (error) {
      showError('שגיאה במחיקת הפריט')
    }
  }
  
  const handleClearPurchased = async () => {
    try {
      await clearPurchasedItems(user?.id)
      playDelete()
      showInfo('כל הפריטים שנקנו נמחקו')
    } catch (error) {
      showError('שגיאה במחיקת הפריטים')
    }
  }
  
  // Complex UI Operations
  const handleCheckout = () => {
    const { inCart } = getItemsByStatus()
    
    if (inCart.length === 0) {
      showError('אין פריטים בסל הקניות')
      return
    }
    
    const itemsWithoutExpiry = inCart.filter(item => !item.expiryDate)
    
    if (itemsWithoutExpiry.length > 0) {
      openExpiryModal(itemsWithoutExpiry)
    } else {
      // All items have expiry dates, proceed directly
      handleCompletePurchase(inCart)
    }
  }
  
  const handleCreateQuickList = async (items: Array<{name: string, category: string}>) => {
    try {
      for (const item of items) {
        await addItem(item.name, item.category, user?.id)
      }
      showSuccess(`נוספו ${items.length} פריטים לרשימה`)
    } catch (error) {
      showError('שגיאה ביצירת רשימה מהירה')
    }
  }
  
  const handleReceiptProcessed = (receiptItems: ShoppingItem[], storeName: string) => {
    // This is display logic - just show the results
    showSuccess(`נסרקו ${receiptItems.length} פריטים מ-${storeName}`)
    closeReceiptScanner()
    
    // Could add the items here or let user review them first
    // For now, just close the scanner
  }
  
  const handleExpiryModalSubmit = async (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => {
    try {
      // Update items with expiry dates first
      for (const item of itemsWithExpiry) {
        if (item.expiryDate) {
          const existingItem = items.find(i => i.id === item.id)
          if (existingItem) {
            await toggleItemCart(item.id, user?.id) // Mark as purchased
          }
        }
      }
      
      closeExpiryModal()
      showSuccess('הקנייה הושלמה בהצלחה!')
      playPurchase()
    } catch (error) {
      showError('שגיאה בהשלמת הקנייה')
    }
  }
  
  const handleCompletePurchase = async (cartItems: ShoppingItem[]) => {
    try {
      for (const item of cartItems) {
        await toggleItemCart(item.id, user?.id) // This will mark as purchased
      }
      showSuccess('הקנייה הושלמה בהצלחה!')
      playPurchase()
    } catch (error) {
      showError('שגיאה בהשלמת הקנייה')
    }
  }
  
  const contextValue: ShoppingListDisplayContextValue = {
    // Data
    items,
    suggestions,
    expiringItems,
    purchaseHistory,
    pantryItems,
    loading,
    error,
    
    // UI State
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
    showTutorial,
    checkoutItems,
    
    // Actions
    handleAddItem,
    handleToggleCart,
    handleRemoveItem,
    handleClearPurchased,
    
    // UI Actions
    openReceiptScanner,
    closeReceiptScanner,
    openExpiryModal,
    closeExpiryModal,
    openDataImportModal,
    closeDataImportModal,
    openTutorial,
    closeTutorial,
    
    // Complex Operations
    handleCheckout,
    handleCreateQuickList,
    handleReceiptProcessed,
    handleExpiryModalSubmit,
    
    // Helpers
    getItemsByStatus,
    hasItemsInCart: hasItemsInCart(),
    hasExpiringItems: hasExpiringItems(),
    hasPurchaseHistory: hasPurchaseHistory(),
    isPantryEmpty: isPantryEmpty(),
    
    // Guest Mode
    shouldShowGuestExplanation,
    dismissGuestExplanation,
    
    // Notifications
    showSuccess,
    showError,
    showInfo,
  }
  
  return (
    <ShoppingListDisplayContext.Provider value={contextValue}>
      {children}
    </ShoppingListDisplayContext.Provider>
  )
}

export const useShoppingListDisplay = () => {
  const context = useContext(ShoppingListDisplayContext)
  if (!context) {
    throw new Error('useShoppingListDisplay must be used within ShoppingListDisplayProvider')
  }
  return context
}
