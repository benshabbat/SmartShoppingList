import { supabase } from '@/lib/supabase'
import type { ShoppingListInsert, ShoppingListUpdate } from '@/app/types/supabase'

export class ShoppingListService {
  // Get all shopping lists for a user
  static async getShoppingLists(userId: string) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Get a specific shopping list
  static async getShoppingList(listId: string) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_items(*)
      `)
      .eq('id', listId)
      .single()

    if (error) throw error
    return data
  }

  // Create a new shopping list
  static async createShoppingList(list: ShoppingListInsert) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert(list)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update a shopping list
  static async updateShoppingList(id: string, updates: ShoppingListUpdate) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete a shopping list
  static async deleteShoppingList(id: string) {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Set active shopping list
  static async setActiveList(userId: string, listId: string) {
    // First, deactivate all lists
    await supabase
      .from('shopping_lists')
      .update({ is_active: false })
      .eq('user_id', userId)

    // Then activate the selected list
    const { data, error } = await supabase
      .from('shopping_lists')
      .update({ is_active: true })
      .eq('id', listId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get active shopping list
  static async getActiveList(userId: string) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_items(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  }
}
