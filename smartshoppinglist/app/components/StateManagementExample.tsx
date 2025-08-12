'use client'

import React from 'react'
import { useShoppingItems, useAddShoppingItem } from '../hooks/useShoppingItems'
import { useShoppingListStore, useUIStore } from '../stores'

/**
 * Example component demonstrating the new state management architecture
 * This shows how to use TanStack Query + Zustand together
 */
export function StateManagementExample() {
  // Using TanStack Query for server state
  const { data: items, isLoading, error } = useShoppingItems()
  const addItemMutation = useAddShoppingItem()

  // Using Zustand stores for client state
  const searchQuery = useShoppingListStore(state => state.searchQuery)
  const setSearchQuery = useShoppingListStore(state => state.setSearchQuery)
  const filters = useShoppingListStore(state => state.filters)
  const setFilter = useShoppingListStore(state => state.setFilter)
  
  // UI state from Zustand
  const addToast = useUIStore(state => state.addToast)
  const theme = useUIStore(state => state.theme)

  // Example: Add a new item
  const handleAddItem = async () => {
    try {
      await addItemMutation.mutateAsync({
        name: 'Example Item',
        category: 'Other',
        isInCart: false,
        isPurchased: false,
      })
      
      addToast({
        message: 'Item added successfully!',
        type: 'success',
        duration: 3000,
      })
    } catch (error) {
      // Error handling is automatic in the mutation hook
    }
  }

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!items) return []
    
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !filters.category || item.category === filters.category
      const matchesPurchased = filters.showPurchased || !item.isPurchased
      
      return matchesSearch && matchesCategory && matchesPurchased
    })
  }, [items, searchQuery, filters])

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Loading shopping items...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">State Management Example</h2>
      <p className="text-gray-600">
        Current theme: {theme} | Items loaded: {items?.length || 0}
      </p>

      {/* Search and Filters */}
      <div className="space-y-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full p-2 border rounded"
        />
        
        <div className="flex gap-2">
          <select 
            value={filters.category || ''}
            onChange={(e) => setFilter('category', e.target.value || null)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Other">Other</option>
          </select>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.showPurchased}
              onChange={(e) => setFilter('showPurchased', e.target.checked)}
            />
            Show purchased items
          </label>
        </div>
      </div>

      {/* Add Item Button */}
      <button
        onClick={handleAddItem}
        disabled={addItemMutation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {addItemMutation.isPending ? 'Adding...' : 'Add Example Item'}
      </button>

      {/* Items List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Shopping Items ({filteredItems.length})
        </h3>
        
        {filteredItems.length === 0 ? (
          <p className="text-gray-500">No items found</p>
        ) : (
          <div className="grid gap-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 border rounded ${
                  item.isPurchased ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={item.isPurchased ? 'line-through' : ''}>
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.category}
                  </span>
                </div>
                {item.expiryDate && (
                  <div className="text-sm text-orange-600">
                    Expires: {item.expiryDate.toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600">
          Debug Info (Click to expand)
        </summary>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
          {JSON.stringify(
            {
              itemsCount: items?.length || 0,
              filteredCount: filteredItems.length,
              searchQuery,
              filters,
              isLoading,
              error: error ? String(error) : null,
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  )
}
