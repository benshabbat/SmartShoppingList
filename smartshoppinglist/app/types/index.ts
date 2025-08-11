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
