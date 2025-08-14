/**
 * Enhanced Context Hooks - Further Props Drilling Prevention
 * These hooks provide even more specific access to context data
 */

'use client'

import { useGlobalShopping } from './GlobalShoppingContext'

// Hook for item-specific actions
export const useItemActions = (itemId?: string) => {
  const { toggleItemInCart, removeItem, addItem } = useGlobalShopping()
  
  return {
    // Generic actions
    addItem,
    
    // Item-specific actions (if itemId provided)
    ...(itemId && {
      toggleInCart: () => toggleItemInCart(itemId),
      remove: () => removeItem(itemId)
    })
  }
}

// Hook for cart-specific operations
export const useCartOperations = () => {
  const { 
    cartItems, 
    hasItemsInCart, 
    handleCheckout, 
    clearCartItems 
  } = useGlobalShopping()
  
  return {
    cartItems,
    hasItemsInCart,
    checkout: handleCheckout,
    clearCart: clearCartItems
  }
}

// Hook for purchase-specific operations  
export const usePurchaseOperations = () => {
  const { 
    purchasedItems, 
    purchaseHistory, 
    clearPurchasedItems,
    hasPurchaseHistory 
  } = useGlobalShopping()
  
  return {
    purchasedItems,
    purchaseHistory,
    clearPurchased: clearPurchasedItems,
    hasPurchaseHistory
  }
}

// Hook for modal management
export const useModalOperations = () => {
  const {
    showReceiptScanner,
    showExpiryModal,
    showDataImportModal,
    showTutorial,
    openReceiptScanner,
    closeReceiptScanner,
    openExpiryModal,
    closeExpiryModal,
    openDataImportModal,
    closeDataImportModal,
    openTutorial,
    closeTutorial
  } = useGlobalShopping()
  
  return {
    // State
    modals: {
      receiptScanner: showReceiptScanner,
      expiryModal: showExpiryModal,
      dataImport: showDataImportModal,
      tutorial: showTutorial
    },
    
    // Actions
    open: {
      receiptScanner: openReceiptScanner,
      expiryModal: openExpiryModal,
      dataImport: openDataImportModal,
      tutorial: openTutorial
    },
    
    close: {
      receiptScanner: closeReceiptScanner,
      expiryModal: closeExpiryModal,
      dataImport: closeDataImportModal,
      tutorial: closeTutorial
    }
  }
}

// Hook for notification management
export const useNotifications = () => {
  const { showSuccess, showError, showInfo } = useGlobalShopping()
  
  return {
    success: showSuccess,
    error: showError,
    info: showInfo
  }
}

// Hook for form management
export const useFormOperations = () => {
  const { 
    itemName, 
    newItemCategory, 
    handleAddItemSubmit,
    handleItemSelect 
  } = useGlobalShopping()
  
  return {
    itemName,
    category: newItemCategory,
    submitForm: handleAddItemSubmit,
    selectItem: handleItemSelect
  }
}
