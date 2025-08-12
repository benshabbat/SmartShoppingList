import { Database } from './database.types'

// Database table types from Supabase
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Shopping item type from database
export type DatabaseShoppingItem = Tables<'shopping_items'>

// Shopping list type from database
export type DatabaseShoppingList = Tables<'shopping_lists'>

// User profile type from database
export type DatabaseUserProfile = Tables<'user_profiles'>

// Categories from database
export type DatabaseCategory = Tables<'categories'>

// Insert/Update types
export type ShoppingItemInsert = Database['public']['Tables']['shopping_items']['Insert']
export type ShoppingItemUpdate = Database['public']['Tables']['shopping_items']['Update']

export type ShoppingListInsert = Database['public']['Tables']['shopping_lists']['Insert']
export type ShoppingListUpdate = Database['public']['Tables']['shopping_lists']['Update']

export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
