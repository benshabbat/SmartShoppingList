'use client'

import { useState, useEffect } from 'react'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'
import { STORAGE_KEYS } from '../utils/constants'
import { generateSuggestions, checkExpiringItems } from '../utils/helpers'
import { useAuth } from './useAuth'
import { ShoppingItemService } from '@/lib/services/shoppingItemService'

// Helper function to convert date strings back to Date objects
const parseDatesInItems = (items: ShoppingItem[]): ShoppingItem[] => {
  return items.map(item => ({
    ...item,
    addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
    purchasedAt: item.purchasedAt ? new Date(item.purchasedAt) : undefined,
    expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
  }))
}

export const useShoppingList = () => {
  const { user, isGuest } = useAuth()
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([])
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([])
  const [purchaseHistory, setPurchaseHistory] = useState<ShoppingItem[]>([])
  const [pantryItems, setPantryItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load data from database or localStorage based on user type
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setLoading(true)
      try {
        if (isGuest) {
          // Load from localStorage for guest users
          loadFromLocalStorage()
        } else {
          // Load from database for authenticated users
          await loadFromDatabase()
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to localStorage on error
        loadFromLocalStorage()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, isGuest])

  const loadFromLocalStorage = () => {
    if (typeof window === 'undefined') return
    
    const savedItems = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST)
    const savedHistory = localStorage.getItem(STORAGE_KEYS.PURCHASE_HISTORY)
    const savedPantry = localStorage.getItem(STORAGE_KEYS.PANTRY_ITEMS)
    const savedLastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT)
    
    if (savedItems) {
      const parsedItems = parseDatesInItems(JSON.parse(savedItems))
      setItems(parsedItems)
    }
    
    if (savedHistory) {
      const history = parseDatesInItems(JSON.parse(savedHistory))
      setPurchaseHistory(history)
      setSuggestions(generateSuggestions(history, JSON.parse(savedItems || '[]')))
    }

    if (savedPantry) {
      const pantry = parseDatesInItems(JSON.parse(savedPantry))
      setPantryItems(pantry)
      setExpiringItems(checkExpiringItems(pantry))
    }

    if (savedLastVisit) {
      const daysSinceVisit = Math.floor((Date.now() - new Date(savedLastVisit).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceVisit >= 1 && savedPantry) {
        setTimeout(() => {
          const pantry = parseDatesInItems(JSON.parse(savedPantry))
          setExpiringItems(checkExpiringItems(pantry))
        }, 1000)
      }
    }

    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, new Date().toISOString())
  }

  const loadFromDatabase = async () => {
    if (!user?.id) return

    try {
      // Load shopping items
      const dbItems = await ShoppingItemService.getShoppingItems(user.id)
      const shoppingItems = dbItems.map(convertDbItemToShoppingItem)
      
      const currentItems = shoppingItems.filter(item => !item.isPurchased)
      const history = shoppingItems.filter(item => item.isPurchased)
      const pantry = shoppingItems.filter(item => item.isPurchased && item.expiryDate)

      setItems(currentItems)
      setPurchaseHistory(history)
      setPantryItems(pantry)
      setSuggestions(generateSuggestions(history, currentItems))
      setExpiringItems(checkExpiringItems(pantry))
    } catch (error) {
      console.error('Error loading from database:', error)
      throw error
    }
  }

  const convertDbItemToShoppingItem = (dbItem: any): ShoppingItem => ({
    id: dbItem.id,
    name: dbItem.name,
    category: dbItem.category,
    isInCart: dbItem.is_in_cart,
    isPurchased: dbItem.is_purchased,
    addedAt: new Date(dbItem.added_at),
    purchasedAt: dbItem.purchased_at ? new Date(dbItem.purchased_at) : undefined,
    expiryDate: dbItem.expiry_date ? new Date(dbItem.expiry_date) : undefined,
    purchaseLocation: dbItem.purchase_location,
    price: dbItem.price
  })

  // Save to appropriate storage when data changes
  useEffect(() => {
    if (!user || loading) return

    if (isGuest) {
      // Save to localStorage for guest users
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items))
      }
    }
    // For authenticated users, save to database in individual functions
  }, [items, user, isGuest, loading])

  useEffect(() => {
    if (!user || loading) return

    if (isGuest && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PANTRY_ITEMS, JSON.stringify(pantryItems))
    }
  }, [pantryItems, user, isGuest, loading])

  const addItem = async (itemName: string, category: string) => {
    if (!itemName.trim() || !user) return
    
    const newItem: ShoppingItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: itemName.trim(),
      category,
      isInCart: false,
      isPurchased: false,
      addedAt: new Date()
    }

    try {
      if (isGuest) {
        // Add to local state for guest users
        setItems(prev => [...prev, newItem])
      } else {
        // Add to database for authenticated users
        const dbItem = await ShoppingItemService.createShoppingItem({
          user_id: user.id,
          name: newItem.name,
          category: newItem.category,
          is_in_cart: newItem.isInCart,
          is_purchased: newItem.isPurchased,
          added_at: newItem.addedAt.toISOString()
        })
        
        const convertedItem = convertDbItemToShoppingItem(dbItem)
        setItems(prev => [...prev, convertedItem])
      }
      
      return newItem.id
    } catch (error) {
      console.error('Error adding item:', error)
      // Fallback to local state on error
      setItems(prev => [...prev, newItem])
      return newItem.id
    }
  }

  const addItemToCart = async (itemName: string, category: string) => {
    if (!itemName.trim() || !user) return
    
    const newItem: ShoppingItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: itemName.trim(),
      category,
      isInCart: true,
      isPurchased: false,
      addedAt: new Date()
    }

    try {
      if (isGuest) {
        setItems(prev => [...prev, newItem])
      } else {
        const dbItem = await ShoppingItemService.createShoppingItem({
          user_id: user.id,
          name: newItem.name,
          category: newItem.category,
          is_in_cart: newItem.isInCart,
          is_purchased: newItem.isPurchased,
          added_at: newItem.addedAt.toISOString()
        })
        
        const convertedItem = convertDbItemToShoppingItem(dbItem)
        setItems(prev => [...prev, convertedItem])
      }
      
      return newItem.id
    } catch (error) {
      console.error('Error adding item to cart:', error)
      setItems(prev => [...prev, newItem])
      return newItem.id
    }
  }

  const toggleItemInCart = async (id: string) => {
    try {
      if (isGuest) {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, isInCart: !item.isInCart } : item
        ))
      } else {
        const item = items.find(item => item.id === id)
        if (!item) return

        await ShoppingItemService.updateShoppingItem(id, {
          is_in_cart: !item.isInCart
        })

        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, isInCart: !item.isInCart } : item
        ))
      }
    } catch (error) {
      console.error('Error toggling item in cart:', error)
      // Apply change locally even on error for better UX
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, isInCart: !item.isInCart } : item
      ))
    }
  }

  const removeItem = async (id: string) => {
    try {
      if (isGuest) {
        setItems(prev => prev.filter(item => item.id !== id))
      } else {
        await ShoppingItemService.deleteShoppingItem(id)
        setItems(prev => prev.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error removing item:', error)
      // Remove locally even on error for better UX
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const markAsPurchased = async (item: ShoppingItem, expiryDate?: Date) => {
    const updatedItem = {
      ...item,
      isPurchased: true,
      purchasedAt: new Date(),
      expiryDate
    }

    try {
      if (isGuest) {
        setItems(prev => prev.map(i => 
          i.id === item.id ? updatedItem : i
        ))
      } else {
        await ShoppingItemService.updateShoppingItem(item.id, {
          is_purchased: true,
          purchased_at: updatedItem.purchasedAt.toISOString(),
          expiry_date: expiryDate?.toISOString() || null
        })

        setItems(prev => prev.map(i => 
          i.id === item.id ? updatedItem : i
        ))
      }

      // Move to purchase history
      setPurchaseHistory(prev => [...prev, updatedItem])
      
      // Add to pantry if has expiry date
      if (expiryDate) {
        setPantryItems(prev => [...prev, updatedItem])
      }

      return updatedItem
    } catch (error) {
      console.error('Error marking item as purchased:', error)
      // Apply changes locally even on error
      setItems(prev => prev.map(i => 
        i.id === item.id ? updatedItem : i
      ))
      setPurchaseHistory(prev => [...prev, updatedItem])
      if (expiryDate) {
        setPantryItems(prev => [...prev, updatedItem])
      }
      return updatedItem
    }
  }

  const clearPurchased = async () => {
    try {
      if (isGuest) {
        setItems(prev => prev.filter(item => !item.isPurchased))
      } else {
        // For authenticated users, you might want to handle this differently
        // For now, just filter locally
        setItems(prev => prev.filter(item => !item.isPurchased))
      }
    } catch (error) {
      console.error('Error clearing purchased items:', error)
      setItems(prev => prev.filter(item => !item.isPurchased))
    }
  }

  const addSuggestedItem = async (suggestionName: string) => {
    await addItem(suggestionName, 'אחר')
    setSuggestions(prev => prev.filter(s => s.name !== suggestionName.toLowerCase()))
  }

  const addExpiringItemToList = async (itemName: string) => {
    await addItem(itemName, 'אחר')
    setExpiringItems(prev => prev.filter(item => item.name !== itemName))
  }

  const removeFromPantry = (itemName: string) => {
    setPantryItems(prev => prev.filter(item => item.name !== itemName))
    setExpiringItems(prev => prev.filter(item => item.name !== itemName))
  }

  const updateItemWithExpiry = async (itemId: string, expiryDate?: Date) => {
    const updatedItem = items.find(item => item.id === itemId)
    if (!updatedItem) return

    const newItem = {
      ...updatedItem,
      isPurchased: true,
      purchasedAt: new Date(),
      expiryDate
    }

    try {
      if (isGuest) {
        // Update items list
        setItems(prev => prev.map(item => 
          item.id === itemId ? newItem : item
        ))

        // Add to purchase history
        const newHistory = [...purchaseHistory, newItem]
        setPurchaseHistory(newHistory)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.PURCHASE_HISTORY, JSON.stringify(newHistory))
        }

        // Add to pantry if it has expiry date
        if (newItem.expiryDate) {
          const newPantry = [...pantryItems, newItem]
          setPantryItems(newPantry)
        }

        setSuggestions(generateSuggestions(newHistory, items))
      } else {
        // Update in database for authenticated users
        await ShoppingItemService.updateShoppingItem(itemId, {
          is_purchased: true,
          purchased_at: newItem.purchasedAt.toISOString(),
          expiry_date: expiryDate?.toISOString() || null
        })

        // Update local state
        setItems(prev => prev.map(item => 
          item.id === itemId ? newItem : item
        ))
        setPurchaseHistory(prev => [...prev, newItem])
        
        if (newItem.expiryDate) {
          setPantryItems(prev => [...prev, newItem])
        }

        setSuggestions(generateSuggestions([...purchaseHistory, newItem], items))
      }
    } catch (error) {
      console.error('Error updating item with expiry:', error)
      // Apply changes locally even on error
      setItems(prev => prev.map(item => 
        item.id === itemId ? newItem : item
      ))
      setPurchaseHistory(prev => [...prev, newItem])
      if (newItem.expiryDate) {
        setPantryItems(prev => [...prev, newItem])
      }
    }
  }

  const addItemsFromReceipt = async (receiptItems: ShoppingItem[]) => {
    try {
      if (isGuest) {
        // Add items to purchase history since they're already purchased
        const newHistory = [...purchaseHistory, ...receiptItems]
        setPurchaseHistory(newHistory)
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.PURCHASE_HISTORY, JSON.stringify(newHistory))
        }

        // Add items with expiry dates to pantry
        const itemsWithExpiry = receiptItems.filter(item => item.expiryDate)
        if (itemsWithExpiry.length > 0) {
          const newPantry = [...pantryItems, ...itemsWithExpiry]
          setPantryItems(newPantry)
        }

        // Update suggestions based on new purchase history
        setSuggestions(generateSuggestions(newHistory, items))
      } else {
        // Add items to database for authenticated users
        for (const receiptItem of receiptItems) {
          await ShoppingItemService.createShoppingItem({
            user_id: user!.id,
            name: receiptItem.name,
            category: receiptItem.category,
            is_in_cart: false,
            is_purchased: true,
            purchased_at: receiptItem.purchasedAt?.toISOString() || new Date().toISOString(),
            expiry_date: receiptItem.expiryDate?.toISOString() || null,
            purchase_location: receiptItem.purchaseLocation || null,
            price: receiptItem.price || null
          })
        }

        // Update local state
        setPurchaseHistory(prev => [...prev, ...receiptItems])
        
        const itemsWithExpiry = receiptItems.filter(item => item.expiryDate)
        if (itemsWithExpiry.length > 0) {
          setPantryItems(prev => [...prev, ...itemsWithExpiry])
        }

        setSuggestions(generateSuggestions([...purchaseHistory, ...receiptItems], items))
      }
    } catch (error) {
      console.error('Error adding items from receipt:', error)
      // Apply changes locally even on error
      setPurchaseHistory(prev => [...prev, ...receiptItems])
      
      const itemsWithExpiry = receiptItems.filter(item => item.expiryDate)
      if (itemsWithExpiry.length > 0) {
        setPantryItems(prev => [...prev, ...itemsWithExpiry])
      }
    }
  }

  const getItemsByStatus = () => {
    const pending = items.filter(item => !item.isInCart && !item.isPurchased)
    const inCart = items.filter(item => item.isInCart && !item.isPurchased)
    const purchased = items.filter(item => item.isPurchased)
    return { pending, inCart, purchased }
  }

  return {
    items,
    suggestions,
    expiringItems,
    purchaseHistory,
    pantryItems,
    addItem,
    addItemToCart,
    toggleItemInCart,
    removeItem,
    markAsPurchased,
    clearPurchased,
    addSuggestedItem,
    addExpiringItemToList,
    removeFromPantry,
    getItemsByStatus,
    setExpiringItems,
    updateItemWithExpiry,
    addItemsFromReceipt
  }
}
