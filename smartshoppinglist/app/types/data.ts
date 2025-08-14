/**
 * Core Data Types - Shopping Items, Categories, and Business Logic
 * Contains all types related to shopping items, categories, suggestions, and core business entities
 */

// === SHOPPING ITEM TYPES ===

export interface ShoppingItem {
  id: string
  name: string
  category: string
  isInCart: boolean
  isPurchased: boolean
  addedAt: Date
  purchasedAt?: Date
  expiryDate?: Date
  purchaseLocation?: string
  price?: number
}

export interface ItemSuggestion {
  id: string
  name: string
  frequency: number
  lastBought?: Date
  daysSinceLastBought: number
  category?: string
  confidence?: number
}

export interface ExpiringItem {
  id: string
  name: string
  expiryDate: Date
  daysUntilExpiry: number
}

// === RECEIPT TYPES ===

export interface ReceiptItem {
  name: string
  price: number
  quantity?: number
  category?: string
}

export interface ReceiptData {
  items: ReceiptItem[]
  storeName: string
  totalAmount: number
  date: Date
}

// === CATEGORY TYPES ===

// Main category type - used throughout the app
export type Category = 
  | 'פירות וירקות'
  | 'מוצרי חלב'
  | 'בשר ודגים'
  | 'לחם ומאפים'
  | 'משקאות'
  | 'חטיפים ומתוקים'
  | 'מוצרי ניקיון'
  | 'מוצרי היגיינה'
  | 'מזון יבש'
  | 'קפואים'
  | 'שימורים ומוכנים'
  | 'תבלינים ורטבים'
  | 'מוצרי בריאות'
  | 'אלכוהול'
  | 'מוצרי תינוקות'
  | 'מוצרי חיות מחמד'
  | 'אחר'

// Legacy category type - kept for backward compatibility with utils/categories.ts
// TODO: Migrate to use Category type and remove this
export type CategoryType = 
  | 'מוצרי חלב'
  | 'בשר ודגים'
  | 'ירקות'
  | 'פירות'
  | 'לחם ומאפים'
  | 'דגנים'
  | 'מתוקים'
  | 'משקאות'
  | 'חטיפים'
  | 'מוכן'
  | 'קפואים'
  | 'שמנים ותבלינים'
  | 'כללי'

// === PRESET & CONFIGURATION TYPES ===

export interface PresetList {
  title: string
  items: Array<{name: string, category: CategoryType}>
  icon?: string
  description?: string
}

// === SHOPPING STATE TYPES ===

// Analytics data structure
export interface ShoppingAnalytics {
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: ShoppingItem[]
  priorityItems: ShoppingItem[]
}

// Shopping state structure
export interface ShoppingState {
  pendingItems: ShoppingItem[]
  cartItems: ShoppingItem[]
  purchasedItems: ShoppingItem[]
  hasItemsInCart: boolean
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
}

// Base shopping data interface
export interface ShoppingDataBase {
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
}

// Shopping actions interface
export interface ShoppingActionsBase {
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  clearCartItems: () => Promise<void>
}
