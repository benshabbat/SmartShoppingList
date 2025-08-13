/**
 * Global Shopping Context Logic Hook
 * Centralized business logic for the global shopping context
 */

import { useCallback, useMemo, useEffect } from 'react'
import { useShoppingDataStore } from '../stores/data/shoppingDataStore'
import { useUIStore } from '../stores/ui/uiStore'
import { useAuth } from '../hooks/useAuth'
import { useToasts } from '../components/Toast'
import { useSoundManager } from '../utils/soundManager'
import { ShoppingItem } from '../types'
import type { 
  EnhancedGlobalShoppingContextValue
} from './types'

export const useGlobalShoppingLogic = (): EnhancedGlobalShoppingContextValue => {
  const { user, isGuest } = useAuth()
  const { showSuccess, showError, showInfo } = useToasts()
  const { playAddToCart, playRemoveFromCart, playPurchase, playDelete } = useSoundManager()
  
  // Store hooks
  const itemsStore = useShoppingDataStore()
  const uiStore = useUIStore()
  
  // App initialization and item loading
  useEffect(() => {
    const initializeApp = () => {
      // Log app initialization
      console.log('App initialized for user:', user?.id || 'guest')
      
      // Initialize store with current user
      if (typeof window !== 'undefined') {
        itemsStore.initializeStore()
      }
    }
    
    initializeApp()
  }, [user?.id, itemsStore])

  // Show welcome message when user transitions from guest to logged in
  useEffect(() => {
    if (user && !isGuest && user.user_metadata) {
      // Only show welcome for real users (not guests)
      const userName = user.user_metadata.full_name || user.email
      uiStore.showWelcome(userName)
    }
  }, [user, isGuest, uiStore])

  // Advanced computed values with memoization
  const computedValues = useMemo(() => {
    const items = itemsStore.items
    const pendingItems = items.filter(item => !item.isPurchased && !item.isInCart)
    const cartItems = items.filter(item => item.isInCart && !item.isPurchased)
    const purchasedItems = items.filter(item => item.isPurchased)
    
    return {
      // Basic item collections
      pendingItems,
      cartItems,
      purchasedItems,
      
      // Advanced computed properties
      hasItemsInCart: cartItems.length > 0,
      hasExpiringItems: itemsStore.expiringItems.length > 0,
      hasPurchaseHistory: purchasedItems.length > 0,
      isPantryEmpty: pendingItems.length === 0 && cartItems.length === 0,
      
      // Shopping statistics
      totalItems: items.length,
      completionRate: items.length > 0 
        ? Math.round((purchasedItems.length / items.length) * 100) 
        : 0,
      
      // Category distribution
      categoryStats: itemsStore.items.reduce((acc: Record<string, number>, item: ShoppingItem) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      
      // Recent activity
      recentlyAdded: [...itemsStore.items]
        .sort((a: ShoppingItem, b: ShoppingItem) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 5),
      
      // Priority items (in cart + expiring soon)
      priorityItems: cartItems.filter((item: ShoppingItem) => 
        item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      )
    }
  }, [itemsStore.items, itemsStore.expiringItems])

  // Enhanced item operations with validation and feedback
  const addItem = useCallback(async (itemName: string, category: string, addToCart = false) => {
    try {
      // Validation
      if (!itemName.trim()) {
        showError('שם הפריט לא יכול להיות רק')
        return
      }

      // Check for duplicates
      const existingItem = itemsStore.items.find(
        (item: ShoppingItem) => item.name.toLowerCase() === itemName.toLowerCase() && !item.isPurchased
      )
      
      if (existingItem) {
        showError(`הפריט "${itemName}" כבר קיים ברשימה`)
        return
      }

      const newItem = await itemsStore.addItem(itemName, category, user?.id || 'guest')
      
      if (newItem && addToCart) {
        await itemsStore.addToCart(newItem.id)
      }
      
      const message = addToCart 
        ? `הפריט "${itemName}" נוסף ישירות לסל`
        : `הפריט "${itemName}" נוסף לרשימה`
      
      showSuccess(message)
      
      if (addToCart) {
        playAddToCart()
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('שגיאה בהוספת הפריט')
      }
    }
  }, [itemsStore, user?.id, showSuccess, showError, playAddToCart])

  const toggleItemInCart = useCallback(async (id: string) => {
    try {
      const item = itemsStore.items.find((i: ShoppingItem) => i.id === id)
      if (!item) {
        showError('הפריט לא נמצא')
        return
      }
      
      await itemsStore.toggleInCart(id)
      
      if (item.isInCart) {
        playRemoveFromCart()
        showInfo(`${item.name} הוסר מהסל`)
      } else {
        playAddToCart()
        showSuccess(`${item.name} נוסף לסל`)
      }
    } catch (error) {
      console.error('Error updating cart status:', error)
      showError('שגיאה בעדכון הפריט')
    }
  }, [itemsStore, playRemoveFromCart, playAddToCart, showInfo, showSuccess, showError])

  const removeItem = useCallback(async (id: string) => {
    try {
      const item = itemsStore.items.find((i: ShoppingItem) => i.id === id)
      if (!item) {
        showError('הפריט לא נמצא')
        return
      }
      
      await itemsStore.deleteItem(id)
      playDelete()
      showError(`${item.name} הוסר מהרשימה`)
    } catch (error) {
      console.error('Error deleting item:', error)
      showError('שגיאה במחיקת הפריט')
    }
  }, [itemsStore, playDelete, showError])

  const clearPurchasedItems = useCallback(async () => {
    try {
      const purchasedCount = computedValues.purchasedItems.length
      
      if (purchasedCount === 0) {
        showInfo('אין פריטים שנקנו למחיקה')
        return
      }

      await itemsStore.clearPurchased()
      playDelete()
      showInfo(`${purchasedCount} פריטים שנקנו נמחקו`)
    } catch (error) {
      console.error('Error clearing purchased items:', error)
      showError('שגיאה במחיקת הפריטים')
    }
  }, [itemsStore, playDelete, showInfo, showError, computedValues.purchasedItems.length])

  // Clear cart items - move all items from cart back to pending
  const clearCartItems = useCallback(async () => {
    try {
      const cartItemsCount = computedValues.cartItems.length
      
      if (cartItemsCount === 0) {
        showInfo('אין פריטים בסל הקניות')
        return
      }

      // Move all cart items back to pending
      for (const item of computedValues.cartItems) {
        await itemsStore.toggleInCart(item.id)
      }
      
      playDelete()
      showInfo(`${cartItemsCount} פריטים הוחזרו לרשימת הקניות`)
    } catch (error) {
      console.error('Error clearing cart items:', error)
      showError('שגיאה בניקוי הסל')
    }
  }, [itemsStore, playDelete, showInfo, showError, computedValues.cartItems])

  // Complex operations with enhanced logic
  const handleCheckout = useCallback(() => {
    const cartItems = computedValues.cartItems
    
    if (cartItems.length === 0) {
      showError('אין פריטים בסל הקניות')
      return
    }
    
    const itemsWithoutExpiry = cartItems.filter((item: ShoppingItem) => !item.expiryDate)
    
    if (itemsWithoutExpiry.length > 0) {
      uiStore.openExpiryModal(itemsWithoutExpiry)
      showInfo(`יש ${itemsWithoutExpiry.length} פריטים ללא תאריך תפוגה`)
    } else {
      completePurchase(cartItems)
    }
  }, [computedValues.cartItems, uiStore, showError, showInfo])

  const createQuickList = useCallback(async (items: Array<{name: string, category: string}>) => {
    try {
      let successCount = 0
      let duplicateCount = 0

      for (const item of items) {
        const existingItem = itemsStore.items.find(
          (existing: ShoppingItem) => existing.name.toLowerCase() === item.name.toLowerCase() && !existing.isPurchased
        )
        
        if (existingItem) {
          duplicateCount++
        } else {
          await itemsStore.addItem(item.name, item.category, user?.id || 'guest')
          successCount++
        }
      }

      let message = `נוספו ${successCount} פריטים לרשימה`
      if (duplicateCount > 0) {
        message += ` (${duplicateCount} פריטים כבר קיימים)`
      }
      
      showSuccess(message)
    } catch (error) {
      console.error('Error creating quick list:', error)
      showError('שגיאה ביצירת רשימה מהירה')
    }
  }, [itemsStore, showSuccess, showError, user?.id])

  const addBulkToCart = useCallback(async (items: Array<{name: string, category: string}>) => {
    try {
      let successCount = 0

      for (const item of items) {
        const existingItem = itemsStore.items.find(
          (existing: ShoppingItem) => existing.name.toLowerCase() === item.name.toLowerCase() && !existing.isPurchased
        )
        
        if (!existingItem) {
          const newItem = await itemsStore.addItem(item.name, item.category, user?.id || 'guest')
          if (newItem) {
            await itemsStore.addToCart(newItem.id)
            successCount++
          }
        }
      }

      showSuccess(`נוספו ${successCount} פריטים לעגלה`)
      if (successCount > 0) {
        playAddToCart()
      }
    } catch (error) {
      console.error('Error adding bulk items to cart:', error)
      showError('שגיאה בהוספת פריטים לעגלה')
    }
  }, [itemsStore, showSuccess, showError, playAddToCart, user?.id])

  const processReceipt = useCallback((receiptItems: ShoppingItem[], storeName: string) => {
    showSuccess(`נסרקו ${receiptItems.length} פריטים מ-${storeName}`)
    uiStore.closeReceiptScanner()
    
    // TODO: Add receipt items to the shopping list
    console.log('Receipt processed:', { receiptItems, storeName })
  }, [showSuccess, uiStore])

  const submitExpiryModal = useCallback(async (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => {
    try {
      for (const item of itemsWithExpiry) {
        if (item.expiryDate) {
          await itemsStore.updateItem(item.id, { 
            isPurchased: true, 
            purchasedAt: new Date(),
            expiryDate: item.expiryDate 
          })
        }
      }
      
      uiStore.closeExpiryModal()
      showSuccess('הקנייה הושלמה בהצלחה!')
      playPurchase()
    } catch (error) {
      console.error('Error completing purchase with expiry:', error)
      showError('שגיאה בהשלמת הקנייה')
    }
  }, [itemsStore, uiStore, showSuccess, showError, playPurchase])

  const completePurchase = useCallback(async (cartItems: ShoppingItem[]) => {
    try {
      for (const item of cartItems) {
        await itemsStore.updateItem(item.id, { 
          isPurchased: true, 
          purchasedAt: new Date() 
        })
      }
      showSuccess('הקנייה הושלמה בהצלחה!')
      playPurchase()
    } catch (error) {
      console.error('Error completing purchase:', error)
      showError('שגיאה בהשלמת הקנייה')
    }
  }, [itemsStore, showSuccess, showError, playPurchase])

  return {
    // Data
    items: itemsStore.items,
    suggestions: itemsStore.suggestions,
    expiringItems: itemsStore.expiringItems,
    purchaseHistory: itemsStore.purchaseHistory,
    pantryItems: itemsStore.pantryItems,
    loading: itemsStore.isLoading,
    error: itemsStore.error,
    
    // UI State
    showReceiptScanner: uiStore.showReceiptScanner,
    showExpiryModal: uiStore.showExpiryModal,
    showDataImportModal: uiStore.showDataImportModal,
    showTutorial: uiStore.showTutorial,
    showWelcomeMessage: uiStore.showWelcomeMessage,
    welcomeUserName: uiStore.welcomeUserName,
    checkoutItems: uiStore.checkoutItems,
    
    // Enhanced computed values
    ...computedValues,
    
    // Core Actions
    addItem,
    toggleItemInCart,
    removeItem,
    clearPurchasedItems,
    clearCartItems,
    
    // UI Actions
    openReceiptScanner: uiStore.openReceiptScanner,
    closeReceiptScanner: uiStore.closeReceiptScanner,
    openExpiryModal: uiStore.openExpiryModal,
    closeExpiryModal: uiStore.closeExpiryModal,
    openDataImportModal: uiStore.openDataImportModal,
    closeDataImportModal: uiStore.closeDataImportModal,
    openTutorial: uiStore.openTutorial,
    closeTutorial: uiStore.closeTutorial,
    showWelcome: uiStore.showWelcome,
    closeWelcome: uiStore.closeWelcome,
    
    // Complex Operations
    handleCheckout,
    createQuickList,
    addBulkToCart,
    processReceipt,
    submitExpiryModal,
    
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
}
