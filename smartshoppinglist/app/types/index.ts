export interface ShoppingItem {
  id: string
  name: string
  category: string
  isInCart: boolean
  isPurchased: boolean
  addedAt: Date
  purchasedAt?: Date
  expiryDate?: Date
}

export interface ItemSuggestion {
  name: string
  frequency: number
  lastBought: Date
  daysSinceLastBought: number
}

export interface ExpiringItem {
  id: string
  name: string
  expiryDate: Date
  daysUntilExpiry: number
}

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
  | 'אחר'
