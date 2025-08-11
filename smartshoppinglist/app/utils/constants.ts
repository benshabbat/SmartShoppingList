import { Category } from '../types'

export const CATEGORIES: Category[] = [
  'פירות וירקות',
  'מוצרי חלב',
  'בשר ודגים',
  'לחם ומאפים',
  'משקאות',
  'חטיפים ומתוקים',
  'מוצרי ניקיון',
  'מוצרי היגיינה',
  'מזון יבש',
  'קפואים',
  'אחר'
]

export const CATEGORY_EMOJIS: Record<Category, string> = {
  'פירות וירקות': '🍎',
  'מוצרי חלב': '🥛',
  'בשר ודגים': '🥩',
  'לחם ומאפים': '🍞',
  'משקאות': '🥤',
  'חטיפים ומתוקים': '🍫',
  'מוצרי ניקיון': '🧽',
  'מוצרי היגיינה': '🧴',
  'מזון יבש': '🌾',
  'קפואים': '❄️',
  'אחר': '📦'
}

export const STORAGE_KEYS = {
  SHOPPING_LIST: 'shoppingList',
  PURCHASE_HISTORY: 'purchaseHistory',
  PANTRY_ITEMS: 'pantryItems',
  LAST_VISIT: 'lastVisit'
} as const
