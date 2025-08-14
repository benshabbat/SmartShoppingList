/**
 * Supabase Database Types
 * Auto-generated types for database tables
 */

// User Profile Types
export interface UserProfile {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export type UserProfileInsert = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
export type UserProfileUpdate = Partial<UserProfileInsert>

// Shopping Item Types
export interface ShoppingItemDB {
  id: string
  user_id: string
  name: string
  category: string
  is_in_cart: boolean
  is_purchased: boolean
  added_at: string
  purchased_at?: string
  expiry_date?: string
  purchase_location?: string
  price?: number
  created_at: string
  updated_at: string
}

export type ShoppingItemInsert = Omit<ShoppingItemDB, 'id' | 'created_at' | 'updated_at'>
export type ShoppingItemUpdate = Partial<ShoppingItemInsert>

// Shopping List Types
export interface ShoppingList {
  id: string
  user_id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ShoppingListInsert = Omit<ShoppingList, 'id' | 'created_at' | 'updated_at'>
export type ShoppingListUpdate = Partial<ShoppingListInsert>
