/**
 * Global Shopping Context - Zero Props Drilling
 * All components can access this context directly without props
 */

'use client'

import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useShoppingDataStore } from '../stores/data/shoppingDataStore'
import { useUIStore } from '../stores/ui/uiStore'
import { useAuth } from '../hooks/useAuth'
import { useToasts } from '../components/Toast'
import { useSoundManager } from '../utils/soundManager'
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
  addItem: (itemName: string, category: string) => Promise<void>
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
  const { user, isGuest } = useAuth()
  const { showSuccess, showError, showInfo } = useToasts()
  const { playAddToCart, playRemoveFromCart, playPurchase, playDelete } = useSoundManager()
  
  // Store hooks
  const itemsStore = useShoppingDataStore()
  const uiStore = useUIStore()
  
  // Load items on mount and when user changes - only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      itemsStore.loadItems(user?.id)
    }
  }, [user?.id, itemsStore.loadItems])
  
  // Computed values (derived state)
  const getItemsByStatus = () => itemsStore.getItemsByStatus()
  const itemsByStatus = getItemsByStatus()
  
  // Core Actions with UI feedback
  const addItem = async (itemName: string, category: string) => {
    try {
      await itemsStore.addItem(itemName, category, user?.id)
      showSuccess(`הפריט "${itemName}" נוסף לרשימה`)
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('שגיאה בהוספת הפריט')
      }
    }
  }
  
  const toggleItemInCart = async (id: string) => {
    try {
      const item = itemsStore.items.find(i => i.id === id)
      if (!item) return
      
      await itemsStore.toggleItemCart(id, user?.id)
      
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
  
  const removeItem = async (id: string) => {
    try {
      const item = itemsStore.items.find(i => i.id === id)
      if (!item) return
      
      await itemsStore.deleteItem(id, user?.id)
      playDelete()
      showError(`${item.name} הוסר מהרשימה`)
    } catch (error) {
      showError('שגיאה במחיקת הפריט')
    }
  }
  
  const clearPurchasedItems = async () => {
    try {
      await itemsStore.clearPurchasedItems(user?.id)
      playDelete()
      showInfo('כל הפריטים שנקנו נמחקו')
    } catch (error) {
      showError('שגיאה במחיקת הפריטים')
    }
  }
  
  // Complex Operations
  const handleCheckout = () => {
    const cartItems = itemsByStatus.inCart
    
    if (cartItems.length === 0) {
      showError('אין פריטים בסל הקניות')
      return
    }
    
    const itemsWithoutExpiry = cartItems.filter(item => !item.expiryDate)
    
    if (itemsWithoutExpiry.length > 0) {
      uiStore.openExpiryModal(itemsWithoutExpiry)
    } else {
      completePurchase(cartItems)
    }
  }
  
  const createQuickList = async (items: Array<{name: string, category: string}>) => {
    try {
      for (const item of items) {
        await itemsStore.addItem(item.name, item.category, user?.id)
      }
      showSuccess(`נוספו ${items.length} פריטים לרשימה`)
    } catch (error) {
      showError('שגיאה ביצירת רשימה מהירה')
    }
  }

  const addBulkToCart = async (items: Array<{name: string, category: string}>) => {
    try {
      for (const item of items) {
        await itemsStore.addItem(item.name, item.category, user?.id, true) // Add directly to cart
      }
      showSuccess(`נוספו ${items.length} פריטים לעגלה`)
      playAddToCart()
    } catch (error) {
      showError('שגיאה בהוספת פריטים לעגלה')
    }
  }
  
  const processReceipt = (receiptItems: ShoppingItem[], storeName: string) => {
    showSuccess(`נסרקו ${receiptItems.length} פריטים מ-${storeName}`)
    uiStore.closeReceiptScanner()
  }
  
  const submitExpiryModal = async (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => {
    try {
      for (const item of itemsWithExpiry) {
        if (item.expiryDate) {
          await itemsStore.updateItem(item.id, { 
            isPurchased: true, 
            purchasedAt: new Date(),
            expiryDate: item.expiryDate 
          }, user?.id)
        }
      }
      
      uiStore.closeExpiryModal()
      showSuccess('הקנייה הושלמה בהצלחה!')
      playPurchase()
    } catch (error) {
      showError('שגיאה בהשלמת הקנייה')
    }
  }
  
  const completePurchase = async (cartItems: ShoppingItem[]) => {
    try {
      for (const item of cartItems) {
        await itemsStore.updateItem(item.id, { 
          isPurchased: true, 
          purchasedAt: new Date() 
        }, user?.id)
      }
      showSuccess('הקנייה הושלמה בהצלחה!')
      playPurchase()
    } catch (error) {
      showError('שגיאה בהשלמת הקנייה')
    }
  }
  
  // Context value - everything a component might need
  const contextValue: GlobalShoppingContextValue = {
    // Data
    items: itemsStore.items,
    suggestions: itemsStore.suggestions,
    expiringItems: itemsStore.expiringItems,
    purchaseHistory: itemsStore.purchaseHistory,
    pantryItems: itemsStore.pantryItems,
    loading: itemsStore.loading,
    error: itemsStore.error,
    
    // UI State
    showReceiptScanner: uiStore.showReceiptScanner,
    showExpiryModal: uiStore.showExpiryModal,
    showDataImportModal: uiStore.showDataImportModal,
    showTutorial: uiStore.showTutorial,
    checkoutItems: uiStore.checkoutItems,
    
    // Core Actions
    addItem,
    toggleItemInCart,
    removeItem,
    clearPurchasedItems,
    
    // UI Actions
    openReceiptScanner: uiStore.openReceiptScanner,
    closeReceiptScanner: uiStore.closeReceiptScanner,
    openExpiryModal: uiStore.openExpiryModal,
    closeExpiryModal: uiStore.closeExpiryModal,
    openDataImportModal: uiStore.openDataImportModal,
    closeDataImportModal: uiStore.closeDataImportModal,
    openTutorial: uiStore.openTutorial,
    closeTutorial: uiStore.closeTutorial,
    
    // Complex Operations
    handleCheckout,
    createQuickList,
    addBulkToCart,
    processReceipt,
    submitExpiryModal,
    
    // Computed Values
    pendingItems: itemsByStatus.pending,
    cartItems: itemsByStatus.inCart,
    purchasedItems: itemsByStatus.purchased,
    hasItemsInCart: itemsStore.hasItemsInCart(),
    hasExpiringItems: itemsStore.hasExpiringItems(),
    hasPurchaseHistory: itemsStore.hasPurchaseHistory(),
    isPantryEmpty: itemsStore.isPantryEmpty(),
    
    // Guest Mode
    shouldShowGuestExplanation: uiStore.shouldShowGuestExplanation(),
    dismissGuestExplanation: uiStore.dismissGuestExplanation,
    
    // Notifications
    showSuccess,
    showError,
    showInfo,
    
    // Sounds
    playAddToCart,
    playRemoveFromCart,
    playPurchase,
    playDelete,
  }
  
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
  const { items, suggestions, expiringItems, purchaseHistory, pantryItems, loading, error } = useGlobalShopping()
  return { items, suggestions, expiringItems, purchaseHistory, pantryItems, loading, error }
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
    hasExpiringItems, hasPurchaseHistory, isPantryEmpty 
  } = useGlobalShopping()
  return { 
    pendingItems, cartItems, purchasedItems, hasItemsInCart, 
    hasExpiringItems, hasPurchaseHistory, isPantryEmpty 
  }
}
