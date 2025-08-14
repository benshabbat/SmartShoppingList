/**
 * Shopping Data Store
 * Unified store for all shopping-related data operations
 * Combines shopping list and items functionality
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ShoppingItem, ItemSuggestion, ExpiringItem, DbShoppingItem, ShoppingDataState } from '../../types'
import { ShoppingItemService } from '@/lib/services/shoppingItemService'
import { STORAGE_KEYS } from '../../constants'
import { generateSuggestions, checkExpiringItems } from '../../utils/helpers'
// Initial State
const initialState: Omit<ShoppingDataState, 'initializeStore' | 'refreshData' | 'addItem' | 'updateItem' | 'deleteItem' | 'addToCart' | 'removeFromCart' | 'toggleInCart' | 'markAsPurchased' | 'markAsUnpurchased' | 'clearPurchased' | 'setSelectedList' | 'setSearchQuery' | 'updateFilters' | 'resetFilters' | 'updateSuggestions' | 'acceptSuggestion' | 'dismissSuggestion' | 'clearError' | 'setError'> = {
  // === CORE DATA ===
  items: [],
  suggestions: [],
  expiringItems: [],
  purchaseHistory: [],
  pantryItems: [],
  
  // === LIST MANAGEMENT ===
  selectedListId: null,
  
  // === FILTERS & SEARCH ===
  filters: {
    category: null,
    showPurchased: false,
    sortBy: 'name',
    sortOrder: 'asc'
  },
  searchQuery: '',
  
  // === STATE ===
  isLoading: false,
  isInitialized: false,
  error: null,
  lastUpdated: null,
}

// Helper functions
const mapDbItemToShoppingItem = (dbItem: DbShoppingItem): ShoppingItem => ({
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

export const useShoppingDataStore = create<ShoppingDataState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // === INITIAL STATE ===
        items: [],
        suggestions: [],
        expiringItems: [],
        purchaseHistory: [],
        pantryItems: [],
        selectedListId: null,
        filters: {
          category: null,
          showPurchased: false,
          sortBy: 'addedAt',
          sortOrder: 'desc'
        },
        searchQuery: '',
        isLoading: false,
        isInitialized: false,
        error: null,
        lastUpdated: null,

        // === INITIALIZATION ===
        initializeStore: async () => {
          const state = get()
          if (state.isInitialized) return

          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            // Load data from Supabase
            const dbItems = await ShoppingItemService.getShoppingItems('')
            const items = dbItems.map(mapDbItemToShoppingItem)

            set((draft) => {
              draft.items = items
              draft.isInitialized = true
              draft.lastUpdated = new Date().toISOString()
            })

            // Update derived data
            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to initialize store:', error)
            set((draft) => {
              draft.error = 'Failed to load shopping data'
            })
          } finally {
            set((draft) => {
              draft.isLoading = false
            })
          }
        },

        refreshData: async () => {
          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            const dbItems = await ShoppingItemService.getShoppingItems('')
            const items = dbItems.map(mapDbItemToShoppingItem)

            set((draft) => {
              draft.items = items
              draft.lastUpdated = new Date().toISOString()
            })

            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to refresh data:', error)
            set((draft) => {
              draft.error = 'Failed to refresh shopping data'
            })
          } finally {
            set((draft) => {
              draft.isLoading = false
            })
          }
        },

        // === ITEMS CRUD ===
        addItem: async (name: string, category: string, userId: string, expiryDate?: string) => {
          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            const newDbItem = await ShoppingItemService.createShoppingItem({
              user_id: userId,
              name,
              category,
              expiry_date: expiryDate || null
            })

            const newItem = mapDbItemToShoppingItem(newDbItem)

            set((draft) => {
              draft.items.push(newItem)
              draft.lastUpdated = new Date().toISOString()
            })

            get().updateSuggestions()
            return newItem

          } catch (error) {
            console.error('Failed to add item:', error)
            set((draft) => {
              draft.error = 'Failed to add item'
            })
            return null
          } finally {
            set((draft) => {
              draft.isLoading = false
            })
          }
        },

        updateItem: async (id: string, updates: Partial<ShoppingItem>) => {
          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            const dbUpdates: Partial<DbShoppingItem> = {}

            if (updates.name !== undefined) dbUpdates.name = updates.name
            if (updates.category !== undefined) dbUpdates.category = updates.category
            if (updates.isInCart !== undefined) dbUpdates.is_in_cart = updates.isInCart
            if (updates.isPurchased !== undefined) dbUpdates.is_purchased = updates.isPurchased
            if (updates.expiryDate !== undefined) {
              dbUpdates.expiry_date = updates.expiryDate ? updates.expiryDate.toISOString() : null
            }
            if (updates.purchaseLocation !== undefined) dbUpdates.purchase_location = updates.purchaseLocation
            if (updates.price !== undefined) dbUpdates.price = updates.price
            if (updates.purchasedAt !== undefined) {
              dbUpdates.purchased_at = updates.purchasedAt ? updates.purchasedAt.toISOString() : null
            }

            await ShoppingItemService.updateShoppingItem(id, dbUpdates)

            set((draft) => {
              const itemIndex = draft.items.findIndex(item => item.id === id)
              if (itemIndex !== -1) {
                Object.assign(draft.items[itemIndex], updates)
              }
              draft.lastUpdated = new Date().toISOString()
            })

            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to update item:', error)
            set((draft) => {
              draft.error = 'Failed to update item'
            })
          } finally {
            set((draft) => {
              draft.isLoading = false
            })
          }
        },

        deleteItem: async (id: string) => {
          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            await ShoppingItemService.deleteShoppingItem(id)

            set((draft) => {
              draft.items = draft.items.filter(item => item.id !== id)
              draft.lastUpdated = new Date().toISOString()
            })

            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to delete item:', error)
            set((draft) => {
              draft.error = 'Failed to delete item'
            })
          } finally {
            set((draft) => {
              draft.isLoading = false
            })
          }
        },

        // === CART ACTIONS ===
        addToCart: async (id: string) => {
          await get().updateItem(id, { isInCart: true })
        },

        removeFromCart: async (id: string) => {
          await get().updateItem(id, { isInCart: false })
        },

        toggleInCart: async (id: string) => {
          const item = get().items.find(item => item.id === id)
          if (item) {
            await get().updateItem(id, { isInCart: !item.isInCart })
          }
        },

        // === PURCHASE ACTIONS ===
        markAsPurchased: async (id: string, location?: string, price?: number) => {
          const updates: Partial<ShoppingItem> = {
            isPurchased: true,
            purchasedAt: new Date(),
            isInCart: false
          }

          if (location) updates.purchaseLocation = location
          if (price) updates.price = price

          await get().updateItem(id, updates)
        },

        markAsUnpurchased: async (id: string) => {
          await get().updateItem(id, {
            isPurchased: false,
            purchasedAt: undefined,
            purchaseLocation: undefined,
            price: undefined
          })
        },

        clearPurchased: async () => {
          const state = get()
          const purchasedItems = state.items.filter(item => item.isPurchased)

          if (purchasedItems.length === 0) return

          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            // Delete all purchased items from database
            for (const item of purchasedItems) {
              await ShoppingItemService.deleteShoppingItem(item.id)
            }

            set((draft) => {
              draft.items = draft.items.filter(item => !item.isPurchased)
              draft.lastUpdated = new Date().toISOString()
            })

            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to clear purchased items:', error)
            set((draft) => {
              draft.error = 'Failed to clear purchased items'
            })
          } finally {
            set((draft) => {
              draft.isLoading = false
            })
          }
        },

        // === LIST MANAGEMENT ===
        setSelectedList: (listId: string | null) => {
          set((draft) => {
            draft.selectedListId = listId
          })
        },

        // === FILTERS & SEARCH ===
        setSearchQuery: (query: string) => {
          set((draft) => {
            draft.searchQuery = query
          })
        },

        updateFilters: (updates: Partial<ShoppingDataState['filters']>) => {
          set((draft) => {
            Object.assign(draft.filters, updates)
          })
        },

        resetFilters: () => {
          set((draft) => {
            draft.filters = {
              category: null,
              showPurchased: false,
              sortBy: 'addedAt',
              sortOrder: 'desc'
            }
            draft.searchQuery = ''
          })
        },

        // === SUGGESTIONS ===
        updateSuggestions: () => {
          const state = get()
          const purchaseHistory = state.items.filter(item => item.isPurchased)
          const suggestions = generateSuggestions(purchaseHistory, state.items)
          const expiringItems = checkExpiringItems(state.items)

          set((draft) => {
            draft.suggestions = suggestions
            draft.expiringItems = expiringItems
          })
        },

        acceptSuggestion: async (suggestion: ItemSuggestion, userId: string) => {
          const newItem = await get().addItem(suggestion.name, suggestion.category || 'other', userId)
          if (newItem) {
            get().dismissSuggestion(suggestion.id)
          }
        },

        dismissSuggestion: (suggestionId: string) => {
          set((draft) => {
            draft.suggestions = draft.suggestions.filter(s => s.id !== suggestionId)
          })
        },

        // === HELPERS ===
        clearError: () => {
          set((draft) => {
            draft.error = null
          })
        },

        setError: (error: string) => {
          set((draft) => {
            draft.error = error
          })
        }
      })),
      {
        name: STORAGE_KEYS.SHOPPING_DATA,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          selectedListId: state.selectedListId,
          filters: state.filters,
          searchQuery: state.searchQuery
        })
      }
    ),
    { name: 'shopping-data-store' }
  )
)

export default useShoppingDataStore
