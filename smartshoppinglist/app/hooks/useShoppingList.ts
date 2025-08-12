'use client'

import { useState, useEffect } from 'react'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'
import { STORAGE_KEYS } from '../utils/constants'
import { generateSuggestions, checkExpiringItems } from '../utils/helpers'

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
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([])
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([])
  const [purchaseHistory, setPurchaseHistory] = useState<ShoppingItem[]>([])
  const [pantryItems, setPantryItems] = useState<ShoppingItem[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    // Only access localStorage on the client side
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
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PANTRY_ITEMS, JSON.stringify(pantryItems))
    }
  }, [pantryItems])

  const addItem = (itemName: string, category: string) => {
    if (!itemName.trim()) return
    
    const newItem: ShoppingItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: itemName.trim(),
      category,
      isInCart: false,
      isPurchased: false,
      addedAt: new Date()
    }
    
    setItems(prev => [...prev, newItem])
    return newItem.id
  }

  const addItemToCart = (itemName: string, category: string) => {
    if (!itemName.trim()) return
    
    const newItem: ShoppingItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: itemName.trim(),
      category,
      isInCart: true,
      isPurchased: false,
      addedAt: new Date()
    }
    
    setItems(prev => [...prev, newItem])
    return newItem.id
  }

  const toggleItemInCart = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isInCart: !item.isInCart } : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const markAsPurchased = (item: ShoppingItem, expiryDate?: Date) => {
    const updatedItem = {
      ...item,
      isPurchased: true,
      purchasedAt: new Date(),
      expiryDate
    }

    setItems(prev => prev.map(i => 
      i.id === item.id ? updatedItem : i
    ))

    const newHistory = [...purchaseHistory, updatedItem]
    setPurchaseHistory(newHistory)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PURCHASE_HISTORY, JSON.stringify(newHistory))
    }

    if (updatedItem.expiryDate) {
      setPantryItems(prev => [...prev, updatedItem])
    }

    setSuggestions(generateSuggestions(newHistory, items))
  }

  const clearPurchased = () => {
    setItems(prev => prev.filter(item => !item.isPurchased))
  }

  const addSuggestedItem = (suggestionName: string) => {
    addItem(suggestionName, 'אחר')
    setSuggestions(prev => prev.filter(s => s.name !== suggestionName.toLowerCase()))
  }

  const addExpiringItemToList = (itemName: string) => {
    addItem(itemName, 'אחר')
    setExpiringItems(prev => prev.filter(item => item.name !== itemName))
  }

  const removeFromPantry = (itemName: string) => {
    setPantryItems(prev => prev.filter(item => item.name !== itemName))
    setExpiringItems(prev => prev.filter(item => item.name !== itemName))
  }

  const updateItemWithExpiry = (itemId: string, expiryDate?: Date) => {
    const updatedItem = items.find(item => item.id === itemId)
    if (!updatedItem) return

    const newItem = {
      ...updatedItem,
      isPurchased: true,
      purchasedAt: new Date(),
      expiryDate
    }

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
  }

  const addItemsFromReceipt = (receiptItems: ShoppingItem[]) => {
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
