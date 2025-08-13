import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../stores/core/authStore'
import { useShoppingDataStore } from '../stores/data/shoppingDataStore'
import { useUIStore } from '../stores/ui/uiStore'
import type { ShoppingItem } from '../types'

// Query Keys
export const shoppingItemKeys = {
  all: ['shopping-items'] as const,
  lists: () => [...shoppingItemKeys.all, 'list'] as const,
  list: (id: string) => [...shoppingItemKeys.lists(), id] as const,
  items: (listId: string) => [...shoppingItemKeys.list(listId), 'items'] as const,
  item: (id: string) => [...shoppingItemKeys.all, 'item', id] as const,
} as const

/**
 * Transform database item to ShoppingItem type
 */
const transformDbItem = (dbItem: Record<string, unknown>): ShoppingItem => ({
  id: dbItem.id as string,
  name: dbItem.name as string,
  category: dbItem.category as string,
  isInCart: dbItem.is_in_cart as boolean || false,
  isPurchased: dbItem.is_purchased as boolean || false,
  addedAt: new Date(dbItem.created_at as string),
  purchasedAt: dbItem.purchased_at ? new Date(dbItem.purchased_at as string) : undefined,
  expiryDate: dbItem.expiry_date ? new Date(dbItem.expiry_date as string) : undefined,
  purchaseLocation: dbItem.purchase_location as string | undefined,
  price: dbItem.price as number | undefined,
})

/**
 * Hook for fetching shopping items
 */
export function useShoppingItems(listId?: string) {
  const user = useAuthStore(state => state.user)
  
  return useQuery({
    queryKey: listId ? shoppingItemKeys.items(listId) : shoppingItemKeys.all,
    queryFn: async (): Promise<ShoppingItem[]> => {
      if (!user || user.isGuest) {
        return []
      }

      let query = supabase
        .from('shopping_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (listId) {
        query = query.eq('list_id', listId)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to fetch shopping items: ${error.message}`)
      }

      return (data || []).map(transformDbItem)
    },
    enabled: !!user && !user.isGuest,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for fetching a single shopping item
 */
export function useShoppingItem(id: string) {
  const user = useAuthStore(state => state.user)
  
  return useQuery({
    queryKey: shoppingItemKeys.item(id),
    queryFn: async (): Promise<ShoppingItem | null> => {
      if (!user || user.isGuest || !id) {
        return null
      }

      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Item not found
        }
        throw new Error(`Failed to fetch shopping item: ${error.message}`)
      }

      return transformDbItem(data)
    },
    enabled: !!user && !user.isGuest && !!id,
  })
}

/**
 * Hook for adding shopping items
 */
export function useAddShoppingItem() {
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)
  const addToast = useUIStore(state => state.addToast)
  const addItem = useShoppingDataStore(state => state.addItem)
  const addToCart = useShoppingDataStore(state => state.addToCart)

  return useMutation({
    mutationFn: async (item: Omit<ShoppingItem, 'id' | 'addedAt'>): Promise<ShoppingItem> => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      if (user.isGuest) {
        // For guest users, create item locally
        const apiNewItem = await addItem(item.name, item.category, user.id, item.expiryDate?.toISOString())
        if (!apiNewItem) {
          throw new Error('Failed to create item')
        }
        if (item.isInCart) {
          await addToCart(apiNewItem.id)
        }
        return apiNewItem
      }

      const { data, error } = await supabase
        .from('shopping_items')
        .insert({
          name: item.name,
          category: item.category,
          is_in_cart: item.isInCart,
          is_purchased: item.isPurchased,
          expiry_date: item.expiryDate?.toISOString(),
          purchase_location: item.purchaseLocation,
          price: item.price,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to add shopping item: ${error.message}`)
      }

      const newItem = transformDbItem(data)
      const storeItem = await addItem(newItem.name, newItem.category, user.id, newItem.expiryDate?.toISOString()) 
      if (!storeItem) {
        throw new Error('Failed to create item in store')
      }
      if (newItem.isInCart) {
        await addToCart(storeItem.id)
      }
      return newItem
    },
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.all })
      
      addToast({
        message: `Added "${newItem.name}" to your shopping list`,
        type: 'success',
        duration: 3000
      })
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || 'Failed to add item',
        type: 'error',
        duration: 5000
      })
    },
  })
}

/**
 * Hook for updating shopping items
 */
export function useUpdateShoppingItem() {
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)
  const addToast = useUIStore(state => state.addToast)
  const updateItem = useShoppingDataStore(state => state.updateItem)

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string
      updates: Partial<ShoppingItem> 
    }): Promise<ShoppingItem> => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      if (user.isGuest) {
        updateItem(id, updates)
        // Return a placeholder for guest mode - in real implementation this would return the updated item
        throw new Error('Guest mode update requires store integration')
      }

      const updateData: Record<string, unknown> = {}
      
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.isInCart !== undefined) updateData.is_in_cart = updates.isInCart
      if (updates.isPurchased !== undefined) {
        updateData.is_purchased = updates.isPurchased
        updateData.purchased_at = updates.isPurchased ? new Date().toISOString() : null
      }
      if (updates.expiryDate !== undefined) {
        updateData.expiry_date = updates.expiryDate?.toISOString() || null
      }
      if (updates.purchaseLocation !== undefined) updateData.purchase_location = updates.purchaseLocation
      if (updates.price !== undefined) updateData.price = updates.price

      const { data, error } = await supabase
        .from('shopping_items')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update shopping item: ${error.message}`)
      }

      const updatedItem = transformDbItem(data)
      updateItem(id, updatedItem)
      return updatedItem
    },
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.all })
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.item(updatedItem.id) })
      
      addToast({
        message: `Updated "${updatedItem.name}"`,
        type: 'success',
        duration: 2000
      })
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || 'Failed to update item',
        type: 'error',
        duration: 5000
      })
    },
  })
}

/**
 * Hook for deleting shopping items
 */
export function useDeleteShoppingItem() {
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)
  const addToast = useUIStore(state => state.addToast)
  const deleteItem = useShoppingDataStore(state => state.deleteItem)

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      if (user.isGuest) {
        await deleteItem(id)
        return
      }

      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Failed to delete shopping item: ${error.message}`)
      }

      await deleteItem(id)
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.all })
      queryClient.removeQueries({ queryKey: shoppingItemKeys.item(deletedId) })
      
      addToast({
        message: 'Item deleted successfully',
        type: 'success',
        duration: 2000
      })
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || 'Failed to delete item',
        type: 'error',
        duration: 5000
      })
    },
  })
}

