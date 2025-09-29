/**
 * Shopping Data Store
 * Unified store for all shopping-related data operations
 * Combines shopping list and items functionality
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ShoppingItem, ItemSuggestion, DbShoppingItem, ShoppingDataState } from '../../types'
import { ShoppingItemService } from '../../../lib/services/data/shoppingItemService'
import { PurchaseHistoryService } from '../../../lib/services/data/purchaseHistoryService'
import { STORAGE_KEYS } from '../../constants'
import { generateSuggestions, checkExpiringItems } from '../../utils/core/helpers'

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
        recentPurchases: [],
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
        initializeStore: async (userId?: string) => {
          const state = get()
          if (state.isInitialized) return

          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            // Only load data from Supabase if we have a valid userId and internet connection
            let items: ShoppingItem[] = []
            let recentPurchases: ShoppingItem[] = []
            
            if (userId && userId !== 'guest') {
              try {
                const dbItems = await ShoppingItemService.getShoppingItems(userId)
                items = dbItems.map(mapDbItemToShoppingItem)
                
                // Load recent purchases from purchase history
                try {
                  const purchaseHistoryItems = await PurchaseHistoryService.getRecentPurchases(userId)
                  recentPurchases = purchaseHistoryItems.map(historyItem => ({
                    id: historyItem.id,
                    name: historyItem.name,
                    category: historyItem.category,
                    isInCart: false,
                    isPurchased: true,
                    addedAt: new Date(historyItem.created_at),
                    purchasedAt: new Date(historyItem.purchased_at),
                    purchaseLocation: historyItem.purchase_location,
                    price: historyItem.price
                  }))
                } catch (historyError) {
                  console.warn('Failed to load purchase history (offline?):', historyError)
                  // Continue without purchase history if it fails
                }
              } catch (itemsError) {
                console.warn('Failed to load items from Supabase (offline?):', itemsError)
                // Fall back to guest mode if database is unavailable
                console.log('Falling back to guest mode due to connection issues')
                userId = 'guest'
              }
            }
            // For guest users, start with empty items array

            set((draft) => {
              draft.items = items
              draft.recentPurchases = recentPurchases
              draft.isInitialized = true
              draft.lastUpdated = new Date().toISOString()
            })

            // Update derived data
            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to initialize store:', error)
            set((draft) => {
              draft.error = 'נראה שאין חיבור לאינטרנט. האפליקציה תפעל במצב אורח.'
              // Still mark as initialized to prevent infinite retries
              draft.isInitialized = true
              // Start with empty items for offline mode
              draft.items = []
              draft.recentPurchases = []
            })
          } finally {
            set((draft) => {
              draft.isLoading = false
            })
          }
        },

        refreshData: async (userId?: string) => {
          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            let items: ShoppingItem[] = []
            
            if (userId && userId !== 'guest') {
              const dbItems = await ShoppingItemService.getShoppingItems(userId)
              items = dbItems.map(mapDbItemToShoppingItem)
            }
            // For guest users, keep existing items

            set((draft) => {
              if (userId && userId !== 'guest') {
                draft.items = items
              }
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
            let newItem: ShoppingItem

            if (userId && userId !== 'guest') {
              // For logged-in users, try to save to Supabase
              try {
                const newDbItem = await ShoppingItemService.createShoppingItem({
                  user_id: userId,
                  name,
                  category,
                  expiry_date: expiryDate || undefined,
                  is_in_cart: false,
                  is_purchased: false,
                  added_at: new Date().toISOString()
                })
                newItem = mapDbItemToShoppingItem(newDbItem)
              } catch (dbError) {
                console.warn('Failed to save to database (offline?), saving locally:', dbError)
                // If database fails, create locally with a temporary ID
                newItem = {
                  id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name,
                  category,
                  isInCart: false,
                  isPurchased: false,
                  addedAt: new Date(),
                  expiryDate: expiryDate ? new Date(expiryDate) : undefined
                }
              }
            } else {
              // For guest users, create item locally
              newItem = {
                id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name,
                category,
                isInCart: false,
                isPurchased: false,
                addedAt: new Date(),
                expiryDate: expiryDate ? new Date(expiryDate) : undefined
              }
            }

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
            // Find the item to check if it exists
            const item = get().items.find(item => item.id === id)
            if (!item) {
              throw new Error('Item not found')
            }

            // For guest mode, just update local state
            if (item.id.startsWith('guest-')) {
              set((draft) => {
                const itemIndex = draft.items.findIndex(item => item.id === id)
                if (itemIndex !== -1) {
                  Object.assign(draft.items[itemIndex], updates)
                }
                draft.lastUpdated = new Date().toISOString()
              })
            } else {
              // For authenticated users, update in Supabase
              const dbUpdates: Partial<DbShoppingItem> = {}

              if (updates.name !== undefined) dbUpdates.name = updates.name
              if (updates.category !== undefined) dbUpdates.category = updates.category
              if (updates.isInCart !== undefined) dbUpdates.is_in_cart = updates.isInCart
              if (updates.isPurchased !== undefined) dbUpdates.is_purchased = updates.isPurchased
              if (updates.expiryDate !== undefined) {
                dbUpdates.expiry_date = updates.expiryDate ? updates.expiryDate.toISOString() : undefined
              }
              if (updates.purchaseLocation !== undefined) dbUpdates.purchase_location = updates.purchaseLocation
              if (updates.price !== undefined) dbUpdates.price = updates.price
              if (updates.purchasedAt !== undefined) {
                dbUpdates.purchased_at = updates.purchasedAt ? updates.purchasedAt.toISOString() : undefined
              }

              await ShoppingItemService.updateShoppingItem(id, dbUpdates)

              set((draft) => {
                const itemIndex = draft.items.findIndex(item => item.id === id)
                if (itemIndex !== -1) {
                  Object.assign(draft.items[itemIndex], updates)
                }
                draft.lastUpdated = new Date().toISOString()
              })
            }

            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to update item:', error)
            set((draft) => {
              draft.error = 'Failed to update item'
            })
            throw error // Re-throw so the calling component can handle it
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
            // Find the item to check if it exists
            const item = get().items.find(item => item.id === id)
            if (!item) {
              throw new Error('Item not found')
            }

            // For guest mode, just remove from local state
            if (item.id.startsWith('guest-')) {
              set((draft) => {
                draft.items = draft.items.filter(item => item.id !== id)
                draft.lastUpdated = new Date().toISOString()
              })
            } else {
              // For authenticated users, delete from Supabase
              await ShoppingItemService.deleteShoppingItem(id)
              
              set((draft) => {
                draft.items = draft.items.filter(item => item.id !== id)
                draft.lastUpdated = new Date().toISOString()
              })
            }

            get().updateSuggestions()

          } catch (error) {
            console.error('Failed to delete item:', error)
            set((draft) => {
              draft.error = 'Failed to delete item'
            })
            throw error // Re-throw so the calling component can handle it
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

        clearPurchased: async (userId?: string) => {
          const state = get()
          const purchasedItems = state.items.filter(item => item.isPurchased)

          if (purchasedItems.length === 0) return

          set((draft) => {
            draft.isLoading = true
            draft.error = null
          })

          try {
            // Save purchased items to purchase history for authenticated users
            if (userId && userId !== 'guest') {
              const historyItems = purchasedItems.map(item => ({
                user_id: userId,
                name: item.name,
                category: item.category,
                quantity: 1,
                price: item.price,
                purchase_location: item.purchaseLocation,
                original_item_id: item.id
              }))

              // Add to purchase history
              await PurchaseHistoryService.addMultipleToPurchaseHistory(historyItems)

              // Delete from main shopping items table
              for (const item of purchasedItems) {
                if (!item.id.startsWith('guest-')) {
                  await ShoppingItemService.deleteShoppingItem(item.id)
                }
              }

              // Update recent purchases in store
              const recentPurchases = await PurchaseHistoryService.getRecentPurchases(userId)
              const mappedRecentPurchases = recentPurchases.map(historyItem => ({
                id: historyItem.id,
                name: historyItem.name,
                category: historyItem.category,
                isInCart: false,
                isPurchased: true,
                addedAt: new Date(historyItem.created_at),
                purchasedAt: new Date(historyItem.purchased_at),
                purchaseLocation: historyItem.purchase_location,
                price: historyItem.price
              }))

              set((draft) => {
                draft.items = draft.items.filter(item => !item.isPurchased)
                draft.recentPurchases = mappedRecentPurchases
                draft.lastUpdated = new Date().toISOString()
              })
            } else {
              // For guest mode, move to recent purchases locally
              set((draft) => {
                const purchasedToMove = draft.items.filter(item => item.isPurchased)
                draft.recentPurchases = [...purchasedToMove, ...draft.recentPurchases].slice(0, 20) // Keep last 20
                draft.items = draft.items.filter(item => !item.isPurchased)
                draft.lastUpdated = new Date().toISOString()
              })
            }

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
