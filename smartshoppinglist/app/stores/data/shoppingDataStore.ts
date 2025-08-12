/**
 * Shopping Data Store
 * Unified store for all shopping-related data operations
 * Combines shopping list and items functionality
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../../types'
import { ShoppingItemService } from '@/lib/services/shoppingItemService'
import { STORAGE_KEYS } from '../../utils/constants'
import { generateSuggestions, checkExpiringItems } from '../../utils/helpers'

// Types
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

interface ShoppingDataState {
  // === CORE DATA ===
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  
  // === LIST MANAGEMENT ===
  selectedListId: string | null
  
  // === FILTERS & SEARCH ===
  filters: {
    category: string | null
    showPurchased: boolean
    sortBy: 'name' | 'category' | 'addedAt' | 'expiryDate'
    sortOrder: 'asc' | 'desc'
  }
  searchQuery: string
  
  // === STATE ===
  loading: boolean
  error: string | null
}

interface ShoppingDataActions {
  // === DATABASE OPERATIONS ===
  loadItems: (userId?: string) => Promise<void>
  addItem: (itemName: string, category: string, userId?: string, isInCart?: boolean) => Promise<string | undefined>
  updateItem: (id: string, updates: Partial<ShoppingItem>, userId?: string) => Promise<void>
  deleteItem: (id: string, userId?: string) => Promise<void>
  toggleItemCart: (id: string, userId?: string) => Promise<void>
  clearPurchasedItems: (userId?: string) => Promise<void>
  
  // === LOCAL STATE OPERATIONS ===
  setItems: (items: ShoppingItem[]) => void
  updateLocalItem: (id: string, updates: Partial<ShoppingItem>) => void
  removeLocalItem: (id: string) => void
  addLocalItem: (item: ShoppingItem) => void
  
  // === LIST MANAGEMENT ===
  setSelectedListId: (listId: string | null) => void
  
  // === SUGGESTIONS & ANALYTICS ===
  setSuggestions: (suggestions: ItemSuggestion[]) => void
  setExpiringItems: (items: ExpiringItem[]) => void
  refreshSuggestions: () => void
  
  // === FILTERING & SEARCH ===
  setFilter: (key: keyof ShoppingDataState['filters'], value: unknown) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
  
  // === BULK OPERATIONS ===
  markAllAsPurchased: () => void
  clearAllItems: () => void
  toggleItemInCart: (id: string) => void
  toggleItemPurchased: (id: string) => void
  
  // === STATE MANAGEMENT ===
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // === COMPUTED VALUES ===
  getItemsByStatus: () => {
    pending: ShoppingItem[]
    inCart: ShoppingItem[]
    purchased: ShoppingItem[]
  }
  getFilteredItems: () => ShoppingItem[]
  hasItemsInCart: () => boolean
  hasExpiringItems: () => boolean
  hasPurchaseHistory: () => boolean
  isPantryEmpty: () => boolean
}

type ShoppingDataStore = ShoppingDataState & ShoppingDataActions

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

// Initial State
const initialState: ShoppingDataState = {
  // Core Data
  items: [],
  suggestions: [],
  expiringItems: [],
  purchaseHistory: [],
  pantryItems: [],
  
  // List Management
  selectedListId: null,
  
  // Filters & Search
  filters: {
    category: null,
    showPurchased: true,
    sortBy: 'addedAt',
    sortOrder: 'desc',
  },
  searchQuery: '',
  
  // State
  loading: false,
  error: null,
}

// Store Implementation
export const useShoppingDataStore = create<ShoppingDataStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // === DATABASE OPERATIONS ===
        loadItems: async (userId) => {
          set((state) => {
            state.loading = true
            state.error = null
          })

          try {
            let items: ShoppingItem[] = []
            
            if (userId && userId !== 'guest') {
              // Load from database for authenticated users
              const response = await ShoppingItemService.getAllItems(userId)
              if (response.data) {
                items = response.data.map(convertDbItemToShoppingItem)
              } else if (response.error) {
                throw new Error(response.error.message)
              }
            } else {
              // Load from localStorage for guest users
              const guestItems = localStorage.getItem(STORAGE_KEYS.GUEST_ITEMS)
              if (guestItems) {
                items = parseDatesInItems(JSON.parse(guestItems))
              }
            }

            set((state) => {
              state.items = items
              state.purchaseHistory = items.filter(item => item.isPurchased)
              state.pantryItems = items.filter(item => item.isPurchased && item.expiryDate)
              state.expiringItems = checkExpiringItems(state.pantryItems)
              state.loading = false
            })

            // Refresh suggestions after loading items
            get().refreshSuggestions()

          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to load items'
              state.loading = false
            })
          }
        },

        addItem: async (itemName, category, userId, isInCart = false) => {
          set((state) => {
            state.loading = true
            state.error = null
          })

          try {
            const newItem: ShoppingItem = {
              id: Date.now().toString(),
              name: itemName.trim(),
              category,
              isInCart,
              isPurchased: false,
              addedAt: new Date(),
            }

            if (userId && userId !== 'guest') {
              // Save to database for authenticated users
              const dbItem = convertShoppingItemToDb(newItem)
              const response = await ShoppingItemService.createItem(dbItem, userId)
              
              if (response.data) {
                newItem.id = response.data.id
              } else if (response.error) {
                throw new Error(response.error.message)
              }
            } else {
              // Save to localStorage for guest users
              const currentItems = get().items
              const updatedItems = [...currentItems, newItem]
              localStorage.setItem(STORAGE_KEYS.GUEST_ITEMS, JSON.stringify(updatedItems))
            }

            set((state) => {
              state.items.push(newItem)
              state.loading = false
            })

            return newItem.id

          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to add item'
              state.loading = false
            })
            return undefined
          }
        },

        updateItem: async (id, updates, userId) => {
          try {
            const currentItems = get().items
            const itemIndex = currentItems.findIndex(item => item.id === id)
            
            if (itemIndex === -1) {
              throw new Error('Item not found')
            }

            const updatedItem = { ...currentItems[itemIndex], ...updates }

            if (userId && userId !== 'guest') {
              // Update in database for authenticated users
              const dbUpdates = convertShoppingItemToDb(updatedItem)
              const response = await ShoppingItemService.updateItem(id, dbUpdates, userId)
              
              if (response.error) {
                throw new Error(response.error.message)
              }
            } else {
              // Update localStorage for guest users
              const updatedItems = [...currentItems]
              updatedItems[itemIndex] = updatedItem
              localStorage.setItem(STORAGE_KEYS.GUEST_ITEMS, JSON.stringify(updatedItems))
            }

            set((state) => {
              state.items[itemIndex] = updatedItem
              if (updatedItem.isPurchased) {
                state.purchaseHistory = state.items.filter(item => item.isPurchased)
                state.pantryItems = state.purchaseHistory.filter(item => item.expiryDate)
                state.expiringItems = checkExpiringItems(state.pantryItems)
              }
            })

          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to update item'
            })
          }
        },

        deleteItem: async (id, userId) => {
          try {
            if (userId && userId !== 'guest') {
              // Delete from database for authenticated users
              const response = await ShoppingItemService.deleteItem(id, userId)
              
              if (response.error) {
                throw new Error(response.error.message)
              }
            } else {
              // Update localStorage for guest users
              const currentItems = get().items
              const updatedItems = currentItems.filter(item => item.id !== id)
              localStorage.setItem(STORAGE_KEYS.GUEST_ITEMS, JSON.stringify(updatedItems))
            }

            set((state) => {
              state.items = state.items.filter(item => item.id !== id)
              state.purchaseHistory = state.items.filter(item => item.isPurchased)
              state.pantryItems = state.purchaseHistory.filter(item => item.expiryDate)
              state.expiringItems = checkExpiringItems(state.pantryItems)
            })

          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to delete item'
            })
          }
        },

        toggleItemCart: async (id, userId) => {
          const item = get().items.find(item => item.id === id)
          if (!item) return

          await get().updateItem(id, { isInCart: !item.isInCart }, userId)
        },

        clearPurchasedItems: async (userId) => {
          const currentItems = get().items
          const purchasedItems = currentItems.filter(item => item.isPurchased)

          try {
            if (userId && userId !== 'guest') {
              // Delete from database for authenticated users
              for (const item of purchasedItems) {
                await ShoppingItemService.deleteItem(item.id, userId)
              }
            } else {
              // Update localStorage for guest users
              const remainingItems = currentItems.filter(item => !item.isPurchased)
              localStorage.setItem(STORAGE_KEYS.GUEST_ITEMS, JSON.stringify(remainingItems))
            }

            set((state) => {
              state.items = state.items.filter(item => !item.isPurchased)
              state.purchaseHistory = []
              state.pantryItems = []
              state.expiringItems = []
            })

          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to clear purchased items'
            })
          }
        },

        // === LOCAL STATE OPERATIONS ===
        setItems: (items) =>
          set((state) => {
            state.items = items
            state.purchaseHistory = items.filter(item => item.isPurchased)
            state.pantryItems = state.purchaseHistory.filter(item => item.expiryDate)
            state.expiringItems = checkExpiringItems(state.pantryItems)
            state.loading = false
            state.error = null
          }),

        updateLocalItem: (id, updates) =>
          set((state) => {
            const itemIndex = state.items.findIndex(item => item.id === id)
            if (itemIndex !== -1) {
              state.items[itemIndex] = { ...state.items[itemIndex], ...updates }
            }
          }),

        removeLocalItem: (id) =>
          set((state) => {
            state.items = state.items.filter(item => item.id !== id)
          }),

        addLocalItem: (item) =>
          set((state) => {
            state.items.push(item)
          }),

        // === LIST MANAGEMENT ===
        setSelectedListId: (listId) =>
          set((state) => {
            state.selectedListId = listId
          }),

        // === SUGGESTIONS & ANALYTICS ===
        setSuggestions: (suggestions) =>
          set((state) => {
            state.suggestions = suggestions
          }),

        setExpiringItems: (items) =>
          set((state) => {
            state.expiringItems = items
          }),

        refreshSuggestions: () => {
          const { purchaseHistory } = get()
          const suggestions = generateSuggestions(purchaseHistory)
          get().setSuggestions(suggestions)
        },

        // === FILTERING & SEARCH ===
        setFilter: (key, value) =>
          set((state) => {
            ;(state.filters as any)[key] = value
          }),

        setSearchQuery: (query) =>
          set((state) => {
            state.searchQuery = query
          }),

        resetFilters: () =>
          set((state) => {
            state.filters = initialState.filters
            state.searchQuery = ''
          }),

        // === BULK OPERATIONS ===
        markAllAsPurchased: () =>
          set((state) => {
            state.items.forEach(item => {
              if (!item.isPurchased) {
                item.isPurchased = true
                item.purchasedAt = new Date()
              }
            })
            state.purchaseHistory = state.items.filter(item => item.isPurchased)
            state.pantryItems = state.purchaseHistory.filter(item => item.expiryDate)
            state.expiringItems = checkExpiringItems(state.pantryItems)
          }),

        clearAllItems: () =>
          set((state) => {
            state.items = []
            state.purchaseHistory = []
            state.pantryItems = []
            state.expiringItems = []
          }),

        toggleItemInCart: (id) =>
          set((state) => {
            const item = state.items.find(item => item.id === id)
            if (item) {
              item.isInCart = !item.isInCart
            }
          }),

        toggleItemPurchased: (id) =>
          set((state) => {
            const item = state.items.find(item => item.id === id)
            if (item) {
              item.isPurchased = !item.isPurchased
              item.purchasedAt = item.isPurchased ? new Date() : undefined
            }
            state.purchaseHistory = state.items.filter(item => item.isPurchased)
            state.pantryItems = state.purchaseHistory.filter(item => item.expiryDate)
            state.expiringItems = checkExpiringItems(state.pantryItems)
          }),

        // === STATE MANAGEMENT ===
        setLoading: (loading) =>
          set((state) => {
            state.loading = loading
          }),

        setError: (error) =>
          set((state) => {
            state.error = error
            state.loading = false
          }),

        clearError: () =>
          set((state) => {
            state.error = null
          }),

        // === COMPUTED VALUES ===
        getItemsByStatus: () => {
          const { items } = get()
          return {
            pending: items.filter(item => !item.isInCart && !item.isPurchased),
            inCart: items.filter(item => item.isInCart && !item.isPurchased),
            purchased: items.filter(item => item.isPurchased),
          }
        },

        getFilteredItems: () => {
          const { items, filters, searchQuery } = get()
          let filteredItems = [...items]

          // Apply category filter
          if (filters.category) {
            filteredItems = filteredItems.filter(item => item.category === filters.category)
          }

          // Apply purchased filter
          if (!filters.showPurchased) {
            filteredItems = filteredItems.filter(item => !item.isPurchased)
          }

          // Apply search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filteredItems = filteredItems.filter(item =>
              item.name.toLowerCase().includes(query) ||
              item.category.toLowerCase().includes(query)
            )
          }

          // Apply sorting
          filteredItems.sort((a, b) => {
            const { sortBy, sortOrder } = filters
            let aValue: any = a[sortBy]
            let bValue: any = b[sortBy]

            // Handle date sorting
            if (sortBy === 'addedAt' || sortBy === 'expiryDate') {
              aValue = aValue ? new Date(aValue).getTime() : 0
              bValue = bValue ? new Date(bValue).getTime() : 0
            }

            // Handle string sorting
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              aValue = aValue.toLowerCase()
              bValue = bValue.toLowerCase()
            }

            if (sortOrder === 'asc') {
              return aValue > bValue ? 1 : -1
            } else {
              return aValue < bValue ? 1 : -1
            }
          })

          return filteredItems
        },

        hasItemsInCart: () => {
          const { items } = get()
          return items.some(item => item.isInCart)
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
      })),
      {
        name: 'shopping-data-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          selectedListId: state.selectedListId,
          filters: state.filters,
        }),
      }
    ),
    {
      name: 'shopping-data-store',
    }
  )
)

// Selectors for better performance
export const useShoppingDataSelectors = {
  items: () => useShoppingDataStore((state) => state.items),
  filteredItems: () => useShoppingDataStore((state) => state.getFilteredItems()),
  itemsByStatus: () => useShoppingDataStore((state) => state.getItemsByStatus()),
  suggestions: () => useShoppingDataStore((state) => state.suggestions),
  expiringItems: () => useShoppingDataStore((state) => state.expiringItems),
  purchaseHistory: () => useShoppingDataStore((state) => state.purchaseHistory),
  pantryItems: () => useShoppingDataStore((state) => state.pantryItems),
  loading: () => useShoppingDataStore((state) => state.loading),
  error: () => useShoppingDataStore((state) => state.error),
  filters: () => useShoppingDataStore((state) => state.filters),
  searchQuery: () => useShoppingDataStore((state) => state.searchQuery),
  selectedListId: () => useShoppingDataStore((state) => state.selectedListId),
}
