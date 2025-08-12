/**
 * Central hook for item operations following SOLID principles
 */

import { useCallback } from 'react'
import { ShoppingItem } from '../types'
import { MESSAGES } from '../utils/appConstants'
import { createBusinessError, handleError } from '../utils/errorHandling'

interface UseItemOperationsProps {
  items: ShoppingItem[]
  onToggleCart: (id: string) => void
  onRemoveItem: (id: string) => void
  onClearPurchased: () => void
  onUpdateItemWithExpiry: (id: string, expiryDate?: Date) => void
  onShowSuccess: (title: string, message: string) => void
  onShowError: (title: string, message: string) => void
  onShowInfo: (title: string, message: string) => void
  onPlaySound: (soundType: 'addToCart' | 'removeFromCart' | 'purchase' | 'delete') => void
  onShowExpiryModal?: (items: ShoppingItem[]) => void
}

export const useItemOperations = ({
  items,
  onToggleCart,
  onRemoveItem,
  onClearPurchased,
  onUpdateItemWithExpiry,
  onShowSuccess,
  onShowError,
  onShowInfo,
  onPlaySound,
  onShowExpiryModal,
}: UseItemOperationsProps) => {
  
  /**
   * Handle toggling item in cart with notifications and sounds
   */
  const handleToggleCart = useCallback((id: string) => {
    try {
      const item = items.find(i => i.id === id)
      if (!item) return

      onToggleCart(id)
      
      if (item.isInCart) {
        onPlaySound('removeFromCart')
        onShowInfo(MESSAGES.INFO.REMOVED_FROM_CART, item.name)
      } else {
        onPlaySound('addToCart')
        onShowSuccess(MESSAGES.SUCCESS.ITEM_ADDED_TO_CART, item.name)
      }
    } catch (error) {
      const appError = handleError(error)
      onShowError('שגיאה', appError.message)
    }
  }, [items, onToggleCart, onPlaySound, onShowSuccess, onShowInfo, onShowError])

  /**
   * Handle removing item with notifications and sounds
   */
  const handleRemoveItem = useCallback((id: string) => {
    try {
      const item = items.find(i => i.id === id)
      if (!item) return

      onRemoveItem(id)
      onPlaySound('delete')
      onShowError(MESSAGES.ERROR.ITEM_REMOVED, item.name)
    } catch (error) {
      const appError = handleError(error)
      onShowError('שגיאה', appError.message)
    }
  }, [items, onRemoveItem, onPlaySound, onShowError])

  /**
   * Handle clearing all purchased items
   */
  const handleClearPurchased = useCallback(() => {
    try {
      onClearPurchased()
      onPlaySound('delete')
      onShowInfo(MESSAGES.INFO.ALL_PURCHASED_CLEARED, '')
    } catch (error) {
      const appError = handleError(error)
      onShowError('שגיאה', appError.message)
    }
  }, [onClearPurchased, onPlaySound, onShowInfo, onShowError])

  /**
   * Handle clearing cart items
   */
  const handleClearCart = useCallback(() => {
    try {
      const cartItems = items.filter(item => item.isInCart && !item.isPurchased)
      
      if (cartItems.length === 0) {
        throw createBusinessError.emptyCart()
      }
      
      // Remove all items from cart
      cartItems.forEach(item => {
        onToggleCart(item.id)
      })
      
      onPlaySound('removeFromCart')
      onShowInfo(MESSAGES.INFO.CART_CLEARED, `${cartItems.length} מוצרים הוסרו מהסל`)
    } catch (error) {
      const appError = handleError(error)
      onShowError('שגיאה', appError.message)
    }
  }, [items, onToggleCart, onPlaySound, onShowInfo, onShowError])

  /**
   * Handle checkout process
   */
  const handleCheckout = useCallback(() => {
    try {
      const cartItems = items.filter(item => item.isInCart && !item.isPurchased)
      
      if (cartItems.length === 0) {
        throw createBusinessError.noItemsToPurchase()
      }
      
      // Show expiry date modal instead of immediately purchasing
      if (onShowExpiryModal) {
        onShowExpiryModal(cartItems)
      } else {
        // Fallback: Mark all cart items as purchased without expiry dates
        cartItems.forEach(item => {
          onUpdateItemWithExpiry(item.id, undefined)
        })
        
        onPlaySound('purchase')
        onShowSuccess(MESSAGES.SUCCESS.PURCHASE_COMPLETED, `${cartItems.length} מוצרים נקנו`)
      }
    } catch (error) {
      const appError = handleError(error)
      onShowError('שגיאה', appError.message)
    }
  }, [items, onUpdateItemWithExpiry, onPlaySound, onShowSuccess, onShowError, onShowExpiryModal])

  /**
   * Handle completing purchase with expiry dates
   */
  const handleCompletePurchase = useCallback((itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => {
    try {
      // Mark all items as purchased with their expiry dates
      itemsWithExpiry.forEach(({ id, expiryDate }) => {
        onUpdateItemWithExpiry(id, expiryDate)
      })
      
      onPlaySound('purchase')
      onShowSuccess(MESSAGES.SUCCESS.PURCHASE_COMPLETED, `${itemsWithExpiry.length} מוצרים נקנו`)
    } catch (error) {
      const appError = handleError(error)
      onShowError('שגיאה', appError.message)
    }
  }, [onUpdateItemWithExpiry, onPlaySound, onShowSuccess, onShowError])

  /**
   * Get items grouped by status
   */
  const getItemsByStatus = useCallback(() => {
    const pending = items.filter(item => !item.isInCart && !item.isPurchased)
    const inCart = items.filter(item => item.isInCart && !item.isPurchased)
    const purchased = items.filter(item => item.isPurchased)
    
    return { pending, inCart, purchased }
  }, [items])

  return {
    handleToggleCart,
    handleRemoveItem,
    handleClearPurchased,
    handleClearCart,
    handleCheckout,
    handleCompletePurchase,
    getItemsByStatus,
  }
}
