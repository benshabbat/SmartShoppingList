// Enhanced Shopping List Context with better state management
'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
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

  // Modal State
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  checkoutItems: ShoppingItem[]

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

  // Modal Actions
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  
  // Complex Actions
  handleCreateQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  handleReceiptProcessed: (receiptItems: ShoppingItem[], storeName: string) => void
  handleExpiryModalSubmit: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  handleAddExpiringItem: (itemName: string) => Promise<void>
  handleCheckoutWithExpiry: () => void
  handleGuestDataImport: () => void
  handleLoginSuccess: () => void
  handleHeaderReceiptScannerOpen: () => void
  shouldShowGuestExplanation: () => boolean
  dismissGuestExplanation: () => void

  // Helper functions
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
  hasItemsInCart: boolean

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

  // Modal state management
  const [showReceiptScanner, setShowReceiptScanner] = useState(false)
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [showDataImportModal, setShowDataImportModal] = useState(false)
  const [checkoutItems, setCheckoutItems] = useState<ShoppingItem[]>([])

  // Helper computed values
  const hasExpiringItems = expiringItems.length > 0
  const hasPurchaseHistory = purchaseHistory.length > 0

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

  // Modal Actions
  const openReceiptScanner = () => setShowReceiptScanner(true)
  const closeReceiptScanner = () => setShowReceiptScanner(false)
  const openExpiryModal = (items: ShoppingItem[]) => {
    setCheckoutItems(items)
    setShowExpiryModal(true)
  }
  const closeExpiryModal = () => {
    setShowExpiryModal(false)
    setCheckoutItems([])
  }
  const openDataImportModal = () => setShowDataImportModal(true)
  const closeDataImportModal = () => setShowDataImportModal(false)

  // Complex Actions
  const handleCreateQuickList = async (items: Array<{name: string, category: string}>) => {
    for (const item of items) {
      await addItem(item.name, item.category)
    }
    showSuccess(`נוספו ${items.length} פריטים לרשימה`)
  }

  const handleReceiptProcessed = (receiptItems: ShoppingItem[], storeName: string) => {
    addItemsFromReceipt(receiptItems)
    closeReceiptScanner()
    showSuccess(`נוספו ${receiptItems.length} פריטים מ${storeName}`)
  }

  const handleExpiryModalSubmit = (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => {
    // Process items with expiry dates
    itemsWithExpiry.forEach(({ id, expiryDate }) => {
      if (expiryDate) {
        updateItemWithExpiry(id, expiryDate)
      }
    })
    closeExpiryModal()
    showSuccess('פריטים נשמרו עם תאריכי תפוגה')
  }

  const handleAddExpiringItem = async (itemName: string) => {
    await addItem(itemName, 'אחר')
    showSuccess(`${itemName} נוסף לרשימה`)
  }

  const handleCheckoutWithExpiry = () => {
    const { inCart } = getItemsByStatus()
    openExpiryModal(inCart)
  }

  const shouldShowGuestExplanation = () => {
    return typeof window !== 'undefined' && !localStorage.getItem('guest_explanation_seen')
  }

  const dismissGuestExplanation = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_explanation_seen', 'true')
    }
  }

  const handleHeaderReceiptScannerOpen = () => {
    if (typeof window !== 'undefined' && (window as any).openReceiptScanner) {
      (window as any).openReceiptScanner()
    }
  }

  const handleGuestDataImport = () => {
    importGuestData()
    showSuccess('הנתונים יובאו בהצלחה!')
  }

  const handleLoginSuccess = () => {
    // Check if there's guest data to import after successful login
    if (hasGuestData()) {
      openDataImportModal()
    }
  }

  // Helper computed values
  const isPantryEmpty = pantryItems.length === 0
  const hasItemsInCart = getItemsByStatus().inCart.length > 0

  // Expose receipt scanner opener to parent components  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openReceiptScanner = openReceiptScanner
    }
  }, [openReceiptScanner])

  const contextValue: ShoppingListContextValue = {
    // Data
    items,
    suggestions,
    purchaseHistory,
    pantryItems,
    expiringItems,
    analytics,

    // Modal State
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
    checkoutItems,

    // Modal Actions
    openReceiptScanner,
    closeReceiptScanner,
    openExpiryModal,
    closeExpiryModal,
    openDataImportModal,
    closeDataImportModal,

    // Complex Actions
    handleCreateQuickList,
    handleReceiptProcessed,
    handleExpiryModalSubmit,
    handleAddExpiringItem,
    handleCheckoutWithExpiry,
    handleGuestDataImport,
    handleLoginSuccess,
    handleHeaderReceiptScannerOpen,
    shouldShowGuestExplanation,
    dismissGuestExplanation,

    // Helper computed values
    isPantryEmpty,
    hasItemsInCart,
    hasExpiringItems,
    hasPurchaseHistory,

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
