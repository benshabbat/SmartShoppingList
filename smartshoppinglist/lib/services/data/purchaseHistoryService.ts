/**
 * Purchase History Service
 * Handles all purchase history-related database operations
 */

import { supabase } from '../../supabase'

export interface PurchaseHistoryItem {
  id: string
  user_id: string
  name: string
  category: string
  quantity: number
  price?: number
  purchase_location?: string
  purchased_at: string
  original_item_id?: string
  created_at: string
  updated_at: string
}

export interface CreatePurchaseHistoryItem {
  user_id: string
  name: string
  category: string
  quantity?: number
  price?: number
  purchase_location?: string
  original_item_id?: string
}

export class PurchaseHistoryService {
  /**
   * Get purchase history for a user
   */
  static async getPurchaseHistory(userId: string, limit = 50): Promise<PurchaseHistoryItem[]> {
    const { data, error } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching purchase history:', error)
      throw new Error('Failed to fetch purchase history')
    }

    return data || []
  }

  /**
   * Get recent purchases (last 7 days)
   */
  static async getRecentPurchases(userId: string): Promise<PurchaseHistoryItem[]> {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data, error } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('user_id', userId)
      .gte('purchased_at', sevenDaysAgo.toISOString())
      .order('purchased_at', { ascending: false })

    if (error) {
      console.error('Error fetching recent purchases:', error)
      throw new Error('Failed to fetch recent purchases')
    }

    return data || []
  }

  /**
   * Get purchases by category
   */
  static async getPurchasesByCategory(userId: string, category: string): Promise<PurchaseHistoryItem[]> {
    const { data, error } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('purchased_at', { ascending: false })

    if (error) {
      console.error('Error fetching purchases by category:', error)
      throw new Error('Failed to fetch purchases by category')
    }

    return data || []
  }

  /**
   * Add item to purchase history
   */
  static async addToPurchaseHistory(item: CreatePurchaseHistoryItem): Promise<PurchaseHistoryItem> {
    const { data, error } = await supabase
      .from('purchase_history')
      .insert([item])
      .select()
      .single()

    if (error) {
      console.error('Error adding to purchase history:', error)
      throw new Error('Failed to add to purchase history')
    }

    return data
  }

  /**
   * Add multiple items to purchase history (bulk operation)
   */
  static async addMultipleToPurchaseHistory(items: CreatePurchaseHistoryItem[]): Promise<PurchaseHistoryItem[]> {
    const { data, error } = await supabase
      .from('purchase_history')
      .insert(items)
      .select()

    if (error) {
      console.error('Error adding multiple items to purchase history:', error)
      throw new Error('Failed to add items to purchase history')
    }

    return data || []
  }

  /**
   * Delete purchase history item
   */
  static async deletePurchaseHistoryItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('purchase_history')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting purchase history item:', error)
      throw new Error('Failed to delete purchase history item')
    }
  }

  /**
   * Get purchase statistics
   */
  static async getPurchaseStatistics(userId: string, days = 30): Promise<{
    totalPurchases: number
    totalSpent: number
    categoriesCount: Record<string, number>
    averagePerDay: number
  }> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('purchase_history')
      .select('category, price, purchased_at')
      .eq('user_id', userId)
      .gte('purchased_at', startDate.toISOString())

    if (error) {
      console.error('Error fetching purchase statistics:', error)
      throw new Error('Failed to fetch purchase statistics')
    }

    const purchases = data || []
    const totalPurchases = purchases.length
    const totalSpent = purchases.reduce((sum, item) => sum + (item.price || 0), 0)
    
    const categoriesCount: Record<string, number> = {}
    purchases.forEach(item => {
      categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1
    })

    const averagePerDay = totalPurchases / days

    return {
      totalPurchases,
      totalSpent,
      categoriesCount,
      averagePerDay
    }
  }

  /**
   * Search purchase history
   */
  static async searchPurchaseHistory(userId: string, searchTerm: string): Promise<PurchaseHistoryItem[]> {
    const { data, error } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('user_id', userId)
      .ilike('name', `%${searchTerm}%`)
      .order('purchased_at', { ascending: false })

    if (error) {
      console.error('Error searching purchase history:', error)
      throw new Error('Failed to search purchase history')
    }

    return data || []
  }
}