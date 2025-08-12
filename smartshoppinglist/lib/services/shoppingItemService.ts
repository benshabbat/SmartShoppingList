import { supabase } from '@/lib/supabase'
import type { ShoppingItemInsert, ShoppingItemUpdate } from '@/app/types/supabase'

export class ShoppingItemService {
  // Get all shopping items for a user
  static async getShoppingItems(userId: string) {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Get shopping items by list
  static async getShoppingItemsByList(listId: string) {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('shopping_list_id', listId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Create a new shopping item
  static async createShoppingItem(item: ShoppingItemInsert) {
    const { data, error } = await supabase
      .from('shopping_items')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update a shopping item
  static async updateShoppingItem(id: string, updates: ShoppingItemUpdate) {
    const { data, error } = await supabase
      .from('shopping_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete a shopping item
  static async deleteShoppingItem(id: string) {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Toggle item in cart status
  static async toggleInCart(id: string, isInCart: boolean) {
    return this.updateShoppingItem(id, { is_in_cart: isInCart })
  }

  // Toggle item purchased status
  static async togglePurchased(id: string, isPurchased: boolean) {
    const updates: ShoppingItemUpdate = {
      is_purchased: isPurchased,
      purchased_at: isPurchased ? new Date().toISOString() : null
    }
    return this.updateShoppingItem(id, updates)
  }

  // Get expiring items
  static async getExpiringItems(userId: string, daysAhead: number = 7) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + daysAhead)

    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('user_id', userId)
      .not('expiry_date', 'is', null)
      .lte('expiry_date', futureDate.toISOString())
      .order('expiry_date', { ascending: true })

    if (error) throw error
    return data
  }

  // Get purchase history for suggestions
  static async getPurchaseHistory(userId: string, itemName: string) {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('user_id', userId)
      .eq('name', itemName)
      .eq('is_purchased', true)
      .order('purchased_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data
  }
}
