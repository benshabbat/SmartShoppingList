import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { ShoppingItem } from '../types'
import { useAuthStore } from '../stores/authStore'
import { useShoppingListStore } from '../stores/shoppingListStore'
import { useUIStore } from '../stores/uiStore'

// Query Keys
export const shoppingItemKeys = {
  all: ['shopping-items'] as const,
  lists: () => [...shoppingItemKeys.all, 'list'] as const,
  list: (id: string) => [...shoppingItemKeys.lists(), id] as const,
  items: (listId: string) => [...shoppingItemKeys.list(listId), 'items'] as const,
  item: (id: string) => [...shoppingItemKeys.all, 'item', id] as const,
}

// Hooks for Shopping Items
export function useShoppingItems(listId?: string) {
  const user = useAuthStore((state) => state.user)
  
  return useQuery({
    queryKey: listId ? shoppingItemKeys.items(listId) : shoppingItemKeys.all,
    queryFn: async (): Promise<ShoppingItem[]> => {
      if (!user || user.isGuest) {
        // For guest users, return empty array or local storage data
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

      // Transform database data to our ShoppingItem type
      return (data || []).map((item): ShoppingItem => ({
        id: item.id,
        name: item.name,
        category: item.category,
        isInCart: item.is_in_cart || false,
        isPurchased: item.is_purchased || false,
        addedAt: new Date(item.created_at),
        purchasedAt: item.purchased_at ? new Date(item.purchased_at) : undefined,
        expiryDate: item.expiry_date ? new Date(item.expiry_date) : undefined,
        purchaseLocation: item.purchase_location,
        price: item.price,
      }))
    },
    enabled: !!user && !user.isGuest,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useShoppingItem(id: string) {
  const user = useAuthStore((state) => state.user)
  
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

      return {
        id: data.id,
        name: data.name,
        category: data.category,
        isInCart: data.is_in_cart || false,
        isPurchased: data.is_purchased || false,
        addedAt: new Date(data.created_at),
        purchasedAt: data.purchased_at ? new Date(data.purchased_at) : undefined,
        expiryDate: data.expiry_date ? new Date(data.expiry_date) : undefined,
        purchaseLocation: data.purchase_location,
        price: data.price,
      }
    },
    enabled: !!user && !user.isGuest && !!id,
  })
}

// Mutation Hooks
export function useAddShoppingItem() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const addToast = useUIStore((state) => state.addToast)
  const addItem = useShoppingListStore((state) => state.addItem)

  return useMutation({
    mutationFn: async (item: Omit<ShoppingItem, 'id' | 'addedAt'>): Promise<ShoppingItem> => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      if (user.isGuest) {
        // For guest users, create item locally
        const newItem: ShoppingItem = {
          ...item,
          id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          addedAt: new Date(),
        }
        addItem(newItem)
        return newItem
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

      const newItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        isInCart: data.is_in_cart || false,
        isPurchased: data.is_purchased || false,
        addedAt: new Date(data.created_at),
        purchasedAt: data.purchased_at ? new Date(data.purchased_at) : undefined,
        expiryDate: data.expiry_date ? new Date(data.expiry_date) : undefined,
        purchaseLocation: data.purchase_location,
        price: data.price,
      }

      addItem(newItem)
      return newItem
    },
    onSuccess: (newItem) => {
      // Invalidate and refetch shopping items
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.all })
      
      addToast({
        message: `Added "${newItem.name}" to your shopping list`,
        type: 'success',
        duration: 3000,
      })
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || 'Failed to add item',
        type: 'error',
        duration: 5000,
      })
    },
  })
}

export function useUpdateShoppingItem() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const addToast = useUIStore((state) => state.addToast)
  const updateItem = useShoppingListStore((state) => state.updateItem)

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
        // For guest users, update item locally
        updateItem(id, updates)
        // We need to return the updated item, but we don't have it here
        // In a real implementation, you might want to get it from the store
        throw new Error('Guest mode update not fully implemented')
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

      const updatedItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        isInCart: data.is_in_cart || false,
        isPurchased: data.is_purchased || false,
        addedAt: new Date(data.created_at),
        purchasedAt: data.purchased_at ? new Date(data.purchased_at) : undefined,
        expiryDate: data.expiry_date ? new Date(data.expiry_date) : undefined,
        purchaseLocation: data.purchase_location,
        price: data.price,
      }

      updateItem(id, updatedItem)
      return updatedItem
    },
    onSuccess: (updatedItem) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.all })
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.item(updatedItem.id) })
      
      addToast({
        message: `Updated "${updatedItem.name}"`,
        type: 'success',
        duration: 2000,
      })
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || 'Failed to update item',
        type: 'error',
        duration: 5000,
      })
    },
  })
}

export function useDeleteShoppingItem() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const addToast = useUIStore((state) => state.addToast)
  const removeItem = useShoppingListStore((state) => state.removeItem)

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      if (user.isGuest) {
        // For guest users, remove item locally
        removeItem(id)
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

      removeItem(id)
    },
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: shoppingItemKeys.all })
      queryClient.removeQueries({ queryKey: shoppingItemKeys.item(deletedId) })
      
      addToast({
        message: 'Item deleted successfully',
        type: 'success',
        duration: 2000,
      })
    },
    onError: (error: Error) => {
      addToast({
        message: error.message || 'Failed to delete item',
        type: 'error',
        duration: 5000,
      })
    },
  })
}
