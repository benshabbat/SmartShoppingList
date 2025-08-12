import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ShoppingItem } from '../types'

// Shopping List Store Types
interface ShoppingListState {
  items: ShoppingItem[]
  selectedListId: string | null
  isLoading: boolean
  error: string | null
  filters: {
    category: string | null
    showPurchased: boolean
    sortBy: 'name' | 'category' | 'addedAt' | 'expiryDate'
    sortOrder: 'asc' | 'desc'
  }
  searchQuery: string
}

interface ShoppingListActions {
  // List Management
  setItems: (items: ShoppingItem[]) => void
  setSelectedListId: (listId: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Item Management
  addItem: (item: ShoppingItem) => void
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void
  removeItem: (id: string) => void
  toggleItemInCart: (id: string) => void
  toggleItemPurchased: (id: string) => void
  
  // Filtering and Search
  setFilter: (key: keyof ShoppingListState['filters'], value: unknown) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void

  // Bulk Operations
  markAllAsPurchased: () => void
  clearPurchasedItems: () => void
  clearAllItems: () => void
}

type ShoppingListStore = ShoppingListState & ShoppingListActions

const initialState: ShoppingListState = {
  items: [],
  selectedListId: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    showPurchased: true,
    sortBy: 'addedAt',
    sortOrder: 'desc',
  },
  searchQuery: '',
}

export const useShoppingListStore = create<ShoppingListStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // List Management
        setItems: (items) =>
          set((state) => {
            state.items = items
            state.isLoading = false
            state.error = null
          }),

        setSelectedListId: (listId) =>
          set((state) => {
            state.selectedListId = listId
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        setError: (error) =>
          set((state) => {
            state.error = error
            state.isLoading = false
          }),

        clearError: () =>
          set((state) => {
            state.error = null
          }),

        // Item Management
        addItem: (item) =>
          set((state) => {
            state.items.push(item)
          }),

        updateItem: (id, updates) =>
          set((state) => {
            const index = state.items.findIndex((item) => item.id === id)
            if (index !== -1) {
              Object.assign(state.items[index], updates)
            }
          }),

        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter((item) => item.id !== id)
          }),

        toggleItemInCart: (id) =>
          set((state) => {
            const item = state.items.find((item) => item.id === id)
            if (item) {
              item.isInCart = !item.isInCart
            }
          }),

        toggleItemPurchased: (id) =>
          set((state) => {
            const item = state.items.find((item) => item.id === id)
            if (item) {
              item.isPurchased = !item.isPurchased
              item.purchasedAt = item.isPurchased ? new Date() : undefined
            }
          }),

        // Filtering and Search
        setFilter: (key, value) =>
          set((state) => {
            // Type assertion to handle the assignment
            ;(state.filters as Record<string, unknown>)[key] = value
          }),

        setSearchQuery: (query) =>
          set((state) => {
            state.searchQuery = query
          }),

        resetFilters: () =>
          set((state) => {
            state.filters = { ...initialState.filters }
            state.searchQuery = ''
          }),

        // Bulk Operations
        markAllAsPurchased: () =>
          set((state) => {
            const now = new Date()
            state.items.forEach((item) => {
              if (!item.isPurchased) {
                item.isPurchased = true
                item.purchasedAt = now
              }
            })
          }),

        clearPurchasedItems: () =>
          set((state) => {
            state.items = state.items.filter((item) => !item.isPurchased)
          }),

        clearAllItems: () =>
          set((state) => {
            state.items = []
          }),
      })),
      {
        name: 'shopping-list-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          selectedListId: state.selectedListId,
          filters: state.filters,
        }),
      }
    ),
    {
      name: 'shopping-list-store',
    }
  )
)

// Selector hooks for optimized re-renders
export const useShoppingListItems = () => useShoppingListStore((state) => state.items)
export const useShoppingListFilters = () => useShoppingListStore((state) => state.filters)
export const useShoppingListSearch = () => useShoppingListStore((state) => state.searchQuery)
export const useShoppingListError = () => useShoppingListStore((state) => state.error)
export const useShoppingListLoading = () => useShoppingListStore((state) => state.isLoading)
