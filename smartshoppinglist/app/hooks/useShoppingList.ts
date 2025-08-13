'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'
import { STORAGE_KEYS } from '../utils/constants'
import { generateSuggestions, checkExpiringItems } from '../utils/helpers'
import { useAuth } from './useAuth'
import { ShoppingItemService } from '@/lib/services/shoppingItemService'

interface DbShoppingItem {
  id: string
  name: string
  category: string
  is_in_cart: boolean
  is_purchased: boolean
  added_at: string
  purchased_at?: string
  expiry_date?: string
  purchase_location?: string
  price?: number
}

/**
 * Helper function to convert date strings back to Date objects
 */
const parseDatesInItems = (items: ShoppingItem[]): ShoppingItem[] => {
  return items.map(item => ({
    ...item,
    addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
    purchasedAt: item.purchasedAt ? new Date(item.purchasedAt) : undefined,
    expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
  }))
}

/**
 * Convert database item to ShoppingItem
 */
const convertDbItemToShoppingItem = (dbItem: DbShoppingItem): ShoppingItem => ({
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

/**
 * Main shopping list hook
 * Manages items, suggestions, expiring items, purchase history, and pantry
 */
export function useShoppingList() {
  const { user, isGuest } = useAuth()
  
  // State
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([])
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([])
  const [purchaseHistory, setPurchaseHistory] = useState<ShoppingItem[]>([])
  const [pantryItems, setPantryItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(false)

  // Data loading functions
  const loadFromLocalStorage = useCallback(() => {
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

    // Check for expiring items notification
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
  }, [])

  const loadFromDatabase = useCallback(async () => {
    if (!user?.id) return

    try {
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
  }, [user])

  // Load data on mount
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setLoading(true)
      try {
        if (isGuest) {
          loadFromLocalStorage()
        } else {
          await loadFromDatabase()
        }
      } catch (error) {
        console.error('Error loading data:', error)
        loadFromLocalStorage() // Fallback
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, isGuest, loadFromLocalStorage, loadFromDatabase])

  // Save to storage when data changes
  useEffect(() => {
    if (!user || loading || !isGuest) return
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items))
    }
  }, [items, user, isGuest, loading])

  useEffect(() => {
    if (!user || loading || !isGuest) return
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PANTRY_ITEMS, JSON.stringify(pantryItems))
    }
  }, [pantryItems, user, isGuest, loading])

  // Item management functions
  const addItem = async (itemName: string, category: string) => {
    if (!itemName.trim()) return
    
    // Check if item already exists
    const existingItem = items.find(item => 
      item.name.toLowerCase().trim() === itemName.toLowerCase().trim()
    )
    
    if (existingItem) {
      if (!existingItem.isInCart) {
        await toggleItemInCart(existingItem.id)
        return existingItem.id
      } else {
        throw new Error('המוצר כבר קיים ברשימה')
      }
    }
    
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
        setItems(prev => [...prev, newItem])
      } else if (user) {
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
      setItems(prev => [...prev, newItem]) // Fallback
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

      setPurchaseHistory(prev => [...prev, updatedItem])
      
      if (expiryDate) {
        setPantryItems(prev => [...prev, updatedItem])
      }

      return updatedItem
    } catch (error) {
      console.error('Error marking item as purchased:', error)
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

  const getItemsByStatus = () => {
    const pending = items.filter(item => !item.isInCart && !item.isPurchased)
    const inCart = items.filter(item => item.isInCart && !item.isPurchased)
    const purchased = items.filter(item => item.isPurchased)
    return { pending, inCart, purchased }
  }

  // Utility functions
  const addSuggestedItem = async (suggestionName: string) => {
    await addItem(suggestionName, 'אחר')
    setSuggestions(prev => prev.filter(s => s.name !== suggestionName.toLowerCase()))
  }

  const clearPurchased = async () => {
    try {
      if (isGuest) {
        setItems(prev => prev.filter(item => !item.isPurchased))
      } else {
        setItems(prev => prev.filter(item => !item.isPurchased))
      }
    } catch (error) {
      console.error('Error clearing purchased items:', error)
      setItems(prev => prev.filter(item => !item.isPurchased))
    }
  }

  return {
    // State
    items,
    suggestions,
    expiringItems,
    purchaseHistory,
    pantryItems,
    loading,
    
    // Actions
    addItem,
    toggleItemInCart,
    removeItem,
    markAsPurchased,
    clearPurchased,
    addSuggestedItem,
    getItemsByStatus,
    
    // Utility
    setExpiringItems,
  }
}
