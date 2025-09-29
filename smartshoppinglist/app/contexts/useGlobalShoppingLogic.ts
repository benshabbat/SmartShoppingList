/**
 * Global Shopping Context Logic Hook
 * Centralized business logic for the global shopping context
 */

import { useCallback, useMemo, useEffect, useState } from 'react'
import { useShoppingDataStore } from '../stores/data/shoppingDataStore'
import { useUIStore } from '../stores/ui/uiStore'
import { useAuth } from '../hooks'
import { useToasts } from '../components/notifications/Toast'
import { useSoundManager } from '../utils/ui/soundManager'
import { useFormField } from '../hooks'
import { generateSmartSuggestions, suggestCategoryForProduct } from '../utils/data/suggestions/smartSuggestions'
import { ShoppingItem, Category } from '../types'
import { 
  createAsyncHandler,
  createBulkOperationHandler,
  filterItemsByStatus,
  calculateItemStats,
  validateItemName,
  checkDuplicateItem,
  MESSAGES
} from '../utils'
import type { 
  EnhancedGlobalShoppingContextValue
} from '../types'

export const useGlobalShoppingLogic = (): EnhancedGlobalShoppingContextValue => {
  const { user, isGuest } = useAuth()
  const { showSuccess, showError, showInfo } = useToasts()
  const { playAddToCart, playRemoveFromCart, playPurchase, playDelete } = useSoundManager()
  
  // Store hooks
  const itemsStore = useShoppingDataStore()
  const uiStore = useUIStore()
  
  // Error handlers
  const asyncHandler = createAsyncHandler('GlobalShoppingLogic', showError)
  
  // === ADD ITEM FORM STATE AND LOGIC ===
  // Form field with validation
  const itemName = useFormField({
    initialValue: '',
    validator: (value: string) => {
      const result = validateItemName(value)
      return result.isValid ? undefined : result.error
    }
  })
  
  // Category state
  const [newItemCategory, setNewItemCategory] = useState<Category>('פירות וירקות')
  const [showCategorySuggestion, setShowCategorySuggestion] = useState(false)
  const [suggestedCategory] = useState<Category | null>(null)
  const [autoChangedCategory, setAutoChangedCategory] = useState(false)

  // Smart suggestions based on category and history
  const smartSuggestions = useMemo(() => {
    const generated = generateSmartSuggestions(newItemCategory, itemsStore.purchaseHistory, itemsStore.items)
    return generated
  }, [newItemCategory, itemsStore.purchaseHistory, itemsStore.items])

  // Auto-suggest category based on product name
  useEffect(() => {
    if (itemName.value.trim().length >= 2) {
      const suggested = suggestCategoryForProduct(itemName.value)
      
      if (suggested && suggested !== newItemCategory && suggested !== 'אחר') {
        setNewItemCategory(suggested as Category)
        setAutoChangedCategory(true)
        setShowCategorySuggestion(false)
        
        // Hide notification after 4 seconds
        setTimeout(() => {
          setAutoChangedCategory(false)
        }, 4000)
      }
    } else {
      if (autoChangedCategory) {
        setAutoChangedCategory(false)
      }
    }
  }, [itemName.value, newItemCategory, autoChangedCategory])

  // Form submission handler
  const handleAddItemSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (itemName.isValid && itemName.value.trim()) {
      await asyncHandler(async () => {
        await itemsStore.addItem(itemName.value.trim(), newItemCategory, user?.id || 'guest')
        showSuccess(MESSAGES.SUCCESS.ITEM_ADDED(itemName.value.trim()))
        itemName.reset()
      })
    }
  }, [itemName, newItemCategory, asyncHandler, showSuccess, itemsStore, user?.id])

  // AutoComplete selection handler
  const handleAutoCompleteSelect = useCallback(async (selectedItem: string) => {
    await asyncHandler(async () => {
      await itemsStore.addItem(selectedItem, newItemCategory, user?.id || 'guest')
      showSuccess(MESSAGES.SUCCESS.ITEM_ADDED(selectedItem))
      itemName.reset()
    })
  }, [newItemCategory, asyncHandler, showSuccess, itemsStore, itemName, user?.id])

  // Category setting handler
  const setCategoryHandler = useCallback((category: string) => {
    setNewItemCategory(category as Category)
  }, [])

  // Category suggestion handlers
  const handleCategorySuggestionAccept = useCallback(() => {
    if (suggestedCategory) {
      setNewItemCategory(suggestedCategory)
      setShowCategorySuggestion(false)
    }
  }, [suggestedCategory])

  const handleCategorySuggestionDismiss = useCallback(() => {
    setShowCategorySuggestion(false)
  }, [])

  // === END ADD ITEM FORM LOGIC ===
  
  // App initialization and item loading
  useEffect(() => {
    const initializeApp = () => {
      // Log app initialization
      console.log('App initialized for user:', user?.id || 'guest')
      
      // Initialize store with current user
      if (typeof window !== 'undefined') {
        itemsStore.initializeStore(user?.id || 'guest')
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

  // Advanced computed values with memoization using utility functions
  const computedValues = useMemo(() => {
    const items = itemsStore.items
    const itemStats = calculateItemStats(items)
    const filteredItems = filterItemsByStatus(items)
    
    return {
      // Basic item collections using utility function
      pendingItems: filteredItems.pending,
      cartItems: filteredItems.inCart,
      purchasedItems: filteredItems.purchased,
      
      // Stats from utility function
      ...itemStats,
      
      // Advanced computed properties
      hasItemsInCart: filteredItems.inCart.length > 0,
      hasExpiringItems: filteredItems.expiring.length > 0,
      hasPurchaseHistory: filteredItems.purchased.length > 0,
      isPantryEmpty: filteredItems.pending.length === 0 && filteredItems.inCart.length === 0,
      
      // Shopping Analytics (required by interface)
      totalItems: itemStats.total,
      completionRate: itemStats.completionRate,
      categoryStats: itemStats.categoryStats,
      
      // Recent activity
      recentlyAdded: [...itemsStore.items]
        .sort((a: ShoppingItem, b: ShoppingItem) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 5),
      
      // Priority items (in cart + expiring soon)
      priorityItems: filteredItems.inCart.filter((item: ShoppingItem) => 
        item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      )
    }
  }, [itemsStore.items])

  // Enhanced item operations with validation and feedback
  const addItem = useCallback(async (itemName: string, category: string, addToCart = false) => {
    const _result = await asyncHandler(async () => {
      // Validation using utility
      const validation = validateItemName(itemName)
      if (!validation.isValid) {
        showError(validation.error!)
        return
      }

      // Check for duplicates using utility
      if (checkDuplicateItem(itemName, itemsStore.items.filter(item => !item.isPurchased))) {
        showError(MESSAGES.ERROR.DUPLICATE_ITEM(itemName))
        return
      }

      const newItem = await itemsStore.addItem(itemName, category, user?.id || 'guest')
      
      if (newItem && addToCart) {
        await itemsStore.addToCart(newItem.id)
      }
      
      const message = addToCart 
        ? MESSAGES.SUCCESS.ITEM_ADDED_TO_CART(itemName)
        : MESSAGES.SUCCESS.ITEM_ADDED(itemName)
      
      showSuccess(message)
      
      if (addToCart) {
        playAddToCart()
      }
    }, MESSAGES.ERROR.ADD_ITEM_FAILED())
  }, [itemsStore, user?.id, showSuccess, showError, playAddToCart, asyncHandler])

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

      await itemsStore.clearPurchased(user?.id || 'guest')
      playDelete()
      showInfo(`${purchasedCount} פריטים שנקנו נשמרו להיסטוריה`)
    } catch (error) {
      console.error('Error clearing purchased items:', error)
      showError('שגיאה במחיקת הפריטים')
    }
  }, [itemsStore, playDelete, showInfo, showError, computedValues.purchasedItems.length, user?.id])

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

  // Complete purchase operation - moved here to be available for handleCheckout
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
  }, [computedValues.cartItems, uiStore, showError, showInfo, completePurchase])

  const createQuickList = useCallback(async (items: Array<{name: string, category: string}>) => {
    const _result = await asyncHandler(async () => {
      // Create bulk operation handler
      const bulkAddHandler = createBulkOperationHandler(
        async (item: {name: string, category: string}) => {
          // Check for duplicates
          if (checkDuplicateItem(item.name, itemsStore.items.filter(existing => !existing.isPurchased))) {
            return false // Skip duplicates
          }
          
          const newItem = await itemsStore.addItem(item.name, item.category, user?.id || 'guest')
          return !!newItem
        },
        (count: number) => `נוספו ${count} פריטים לרשימה`,
        'שגיאה ביצירת רשימה מהירה'
      )

      const operationResult = await bulkAddHandler(items)
      const duplicateCount = items.length - operationResult.count!
      
      let message = operationResult.message!
      if (duplicateCount > 0) {
        message += ` (${duplicateCount} פריטים כבר קיימים)`
      }
      
      showSuccess(message)
    }, 'שגיאה ביצירת רשימה מהירה')
  }, [itemsStore, showSuccess, user?.id, asyncHandler])

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

  return {
    // Data
    items: itemsStore.items,
    suggestions: itemsStore.suggestions,
    expiringItems: itemsStore.expiringItems,
    purchaseHistory: itemsStore.purchaseHistory,
    pantryItems: itemsStore.pantryItems,
    recentPurchases: itemsStore.recentPurchases,
    loading: itemsStore.isLoading,
    error: itemsStore.error,
    
    // Add Item Form Data
    itemName: {
      ...itemName,
      onChange: itemName.setValue
    },
    newItemCategory,
    setNewItemCategory: setCategoryHandler,
    smartSuggestions,
    autoChangedCategory,
    showCategorySuggestion,
    suggestedCategory,
    
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
    
    // Add Item Form Actions
    handleAddItemSubmit,
    handleAutoCompleteSelect,
    handleCategorySuggestionAccept,
    handleCategorySuggestionDismiss,
    
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
