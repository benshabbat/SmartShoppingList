/**
 * Shopping Items Store - State Management Layer
 * Handles all database operations and data management
 * Follows single responsibility principle
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'
import { ShoppingItemService } from '@/lib/services/shoppingItemService'
import { STORAGE_KEYS } from '../utils/constants'
import { generateSuggestions, checkExpiringItems } from '../utils/helpers'

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

interface ShoppingItemsState {
  // Data State
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null

  // Database Operations
  loadItems: (userId?: string) => Promise<void>
  addItem: (itemName: string, category: string, userId?: string, isInCart?: boolean) => Promise<string | undefined>
  updateItem: (id: string, updates: Partial<ShoppingItem>, userId?: string) => Promise<void>
  deleteItem: (id: string, userId?: string) => Promise<void>
  toggleItemCart: (id: string, userId?: string) => Promise<void>
  clearPurchasedItems: (userId?: string) => Promise<void>
  
  // Local State Management
  updateLocalItem: (id: string, updates: Partial<ShoppingItem>) => void
  removeLocalItem: (id: string) => void
  addLocalItem: (item: ShoppingItem) => void
  setItems: (items: ShoppingItem[]) => void
  setSuggestions: (suggestions: ItemSuggestion[]) => void
  setExpiringItems: (items: ExpiringItem[]) => void
  
  // Helper Functions
  getItemsByStatus: () => {
    pending: ShoppingItem[]
    inCart: ShoppingItem[]
    purchased: ShoppingItem[]
  }
  hasItemsInCart: () => boolean
  hasExpiringItems: () => boolean
  hasPurchaseHistory: () => boolean
  isPantryEmpty: () => boolean
}

// Helper functions
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
  price: dbItem.price,
})

const convertShoppingItemToDb = (item: ShoppingItem): Omit<DbShoppingItem, 'id'> => ({
  name: item.name,
  category: item.category,
  is_in_cart: item.isInCart,
  is_purchased: item.isPurchased,
  added_at: item.addedAt.toISOString(),
  purchased_at: item.purchasedAt?.toISOString(),
  expiry_date: item.expiryDate?.toISOString(),
  purchase_location: item.purchaseLocation,
  price: item.price,
})

const parseDatesInItems = (items: ShoppingItem[]): ShoppingItem[] => {
  return items.map(item => ({
    ...item,
    addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
    purchasedAt: item.purchasedAt ? new Date(item.purchasedAt) : undefined,
    expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
  }))
}

export const useShoppingItemsStore = create<ShoppingItemsState>()(
  devtools(
    (set, get) => ({
      // Initial State
      items: [],
      suggestions: [],
      expiringItems: [],
      purchaseHistory: [],
      pantryItems: [],
      loading: false,
      error: null,

      // Database Operations
      loadItems: async (userId) => {
        set({ loading: true, error: null })
        try {
          let items: ShoppingItem[] = []
          
          if (userId) {
            // Load from database for authenticated users
            const dbItems = await ShoppingItemService.getShoppingItems(userId)
            items = dbItems.map(convertDbItemToShoppingItem)
          } else {
            // Load from localStorage for guest users
            const stored = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST)
            if (stored) {
              const parsedItems = JSON.parse(stored)
              items = parseDatesInItems(parsedItems)
            }
          }

          // Separate items by status
          const purchaseHistory = items.filter(item => item.isPurchased)
          const pantryItems = items.filter(item => item.isPurchased && item.expiryDate)

          // Generate suggestions and check expiring items
          const suggestions = generateSuggestions(purchaseHistory, items)
          const expiringItems = checkExpiringItems(items)

          set({ 
            items, 
            suggestions, 
            expiringItems, 
            purchaseHistory, 
            pantryItems, 
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load items', 
            loading: false 
          })
        }
      },

      addItem: async (itemName, category, userId, isInCart = false) => {
        set({ loading: true, error: null })
        try {
          const { items } = get()
          
          // Check if item already exists
          const existingItem = items.find(item => 
            item.name.toLowerCase() === itemName.toLowerCase()
          )

          if (existingItem) {
            if (existingItem.isInCart) {
              throw new Error(`הפריט "${itemName}" כבר נמצא בסל הקניות`)
            } else {
              // Toggle to cart if exists but not in cart
              await get().toggleItemCart(existingItem.id, userId)
              return existingItem.id
            }
          }

          const newItem: ShoppingItem = {
            id: crypto.randomUUID(),
            name: itemName,
            category,
            isInCart: isInCart,
            isPurchased: false,
            addedAt: new Date(),
          }

          if (userId) {
            // Save to database
            const dbItem = convertShoppingItemToDb(newItem)
            await ShoppingItemService.createShoppingItem({ id: newItem.id, user_id: userId, ...dbItem })
          } else {
            // Save to localStorage
            const updatedItems = [...items, newItem]
            localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(updatedItems))
          }

          set(state => ({ 
            items: [...state.items, newItem], 
            loading: false 
          }))
          
          return newItem.id
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add item', 
            loading: false 
          })
          throw error
        }
      },

      updateItem: async (id, updates, userId) => {
        try {
          const { items } = get()
          const itemIndex = items.findIndex(item => item.id === id)
          if (itemIndex === -1) return

          const updatedItem = { ...items[itemIndex], ...updates }

          if (userId) {
            // Update in database
            const dbUpdates = convertShoppingItemToDb(updatedItem)
            await ShoppingItemService.updateShoppingItem(id, dbUpdates)
          } else {
            // Update in localStorage
            const updatedItems = [...items]
            updatedItems[itemIndex] = updatedItem
            localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(updatedItems))
          }

          set(state => ({
            items: state.items.map(item => 
              item.id === id ? updatedItem : item
            )
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update item' })
          throw error
        }
      },

      deleteItem: async (id, userId) => {
        try {
          if (userId) {
            // Delete from database
            await ShoppingItemService.deleteShoppingItem(id)
          } else {
            // Delete from localStorage
            const { items } = get()
            const updatedItems = items.filter(item => item.id !== id)
            localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(updatedItems))
          }

          set(state => ({
            items: state.items.filter(item => item.id !== id)
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete item' })
          throw error
        }
      },

      toggleItemCart: async (id, userId) => {
        const { items } = get()
        const item = items.find(i => i.id === id)
        if (!item) return

        await get().updateItem(id, { isInCart: !item.isInCart }, userId)
      },

      clearPurchasedItems: async (userId) => {
        const { items } = get()
        const purchasedItems = items.filter(item => item.isPurchased)
        
        for (const item of purchasedItems) {
          await get().deleteItem(item.id, userId)
        }
      },

      // Local State Management (for UI optimizations)
      updateLocalItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        }))
      },

      removeLocalItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      addLocalItem: (item) => {
        set(state => ({
          items: [...state.items, item]
        }))
      },

      setItems: (items) => set({ items }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setExpiringItems: (expiringItems) => set({ expiringItems }),

      // Helper Functions
      getItemsByStatus: () => {
        const { items } = get()
        return {
          pending: items.filter(item => !item.isInCart && !item.isPurchased),
          inCart: items.filter(item => item.isInCart && !item.isPurchased),
          purchased: items.filter(item => item.isPurchased),
        }
      },

      hasItemsInCart: () => {
        const { items } = get()
        return items.some(item => item.isInCart && !item.isPurchased)
      },

      hasExpiringItems: () => {
        const { expiringItems } = get()
        return expiringItems.length > 0
      },

      hasPurchaseHistory: () => {
        const { purchaseHistory } = get()
        return purchaseHistory.length > 0
      },

      isPantryEmpty: () => {
        const { pantryItems } = get()
        return pantryItems.length === 0
      },
    }),
    {
      name: 'shopping-items-store',
    }
  )
)
