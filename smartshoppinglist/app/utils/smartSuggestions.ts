import { ShoppingItem } from '../types'
import { COMMON_PRODUCTS } from '../constants'
import { logger } from './helpers'

// פונקציה לזיהוי קטגוריה למוצר - alias לפונקציה קיימת
export const categorizeItem = (productName: string): string => {
  return suggestCategoryForProduct(productName)
}

// פונקציה ליצירת הצעות חכמות על בסיס התנהגות המשתמש
export const generateSmartSuggestions = (
  category: string,
  purchaseHistory: ShoppingItem[],
  currentItems: ShoppingItem[]
): string[] => {
  logger.debug('📝 Generating suggestions for:', { category, historyCount: purchaseHistory.length, currentCount: currentItems.length })
  
  // מוצרים שנקנו בעבר באותה קטגוריה
  const historyItems = purchaseHistory
    .filter(item => item.category === category)
    .map(item => item.name.toLowerCase())

  // מוצרים שכבר ברשימה הנוכחת
  const currentItemNames = currentItems
    .map(item => item.name.toLowerCase())

  // מוצרים נפוצים בקטגוריה
  const commonItems = COMMON_PRODUCTS[category as keyof typeof COMMON_PRODUCTS] || []
  logger.debug(`🏪 Common items for category ${category}:`, commonItems.slice(0, 5))

  // ספירת תדירות של מוצרים בהיסטוריה
  const frequency: Record<string, number> = {}
  historyItems.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1
  })

  // משקל לפי תדירות + מוצרים נפוצים
  const weightedSuggestions = [
    // מוצרים מההיסטוריה עם משקל גבוה יותר
    ...Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .map(([item]) => item),
    // מוצרים נפוצים
    ...commonItems.map(item => item.toLowerCase())
  ]

  // סינון כפילויות ומוצרים שכבר ברשימה
  const uniqueSuggestions = Array.from(new Set(weightedSuggestions))
    .filter(item => !currentItemNames.includes(item))

  // החזרה עם אותיות ראשיות גדולות
  const finalSuggestions = uniqueSuggestions
    .map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .slice(0, 10) // מגביל ל-10 הצעות
    
  logger.debug('✨ Final suggestions:', finalSuggestions)
  return finalSuggestions
}

// פונקציה לחיפוש מתקדם עם פופולריות
export const searchWithPopularity = (
  query: string,
  suggestions: string[],
  purchaseHistory: ShoppingItem[]
): string[] => {
  if (!query.trim()) return suggestions.slice(0, 8)

  const lowerQuery = query.toLowerCase()
  
  // ספירת תדירות בהיסטוריה
  const frequency: Record<string, number> = {}
  purchaseHistory.forEach(item => {
    const itemName = item.name.toLowerCase()
    frequency[itemName] = (frequency[itemName] || 0) + 1
  })

  // סינון והרמת הצעות שמכילות את הטקסט
  const filtered = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(lowerQuery)
  )

  // מיון לפי רלוונטיות ופופולריות
  const sorted = filtered.sort((a, b) => {
    const aLower = a.toLowerCase()
    const bLower = b.toLowerCase()
    
    // עדיפות למוצרים שמתחילים עם החיפוש
    const aStartsWith = aLower.startsWith(lowerQuery) ? 1 : 0
    const bStartsWith = bLower.startsWith(lowerQuery) ? 1 : 0
    
    if (aStartsWith !== bStartsWith) {
      return bStartsWith - aStartsWith
    }

    // עדיפות למוצרים פופולריים
    const aFreq = frequency[aLower] || 0
    const bFreq = frequency[bLower] || 0
    
    if (aFreq !== bFreq) {
      return bFreq - aFreq
    }

    // מיון אלפבתי
    return a.localeCompare(b, 'he')
  })

  return sorted.slice(0, 8)
}

// פונקציה לזיהוי הקטגוריה המתאימה למוצר
export const suggestCategoryForProduct = (_productName: string) => {
  const _detectedCategory = 'אחר' // placeholder כיוון שהפונקציה detectCategory לא קיימת
  
  // מיפוי הקטגוריות החדשות לקטגוריות הישנות בממשק
  const categoryMapping: Record<string, string> = {
    'מוצרי חלב': 'מוצרי חלב',
    'בשר ודגים': 'בשר ודגים', 
    'ירקות': 'פירות וירקות',
    'פירות': 'פירות וירקות',
    'לחם ומאפים': 'לחם ומאפים',
    'דגנים': 'מזון יבש',
    'מתוקים': 'חטיפים ומתוקים',
    'משקאות': 'משקאות',
    'חטיפים': 'חטיפים ומתוקים',
    'מוכן': 'שימורים ומוכנים',
    'קפואים': 'קפואים',
    'שמנים ותבלינים': 'תבלינים ורטבים',
    'כללי': 'אחר'
  }
  
  return categoryMapping[_detectedCategory] || 'אחר'
}

// פונקציה לקבלת המוצרים הפופולריים ביותר
export const getPopularItems = (
  purchaseHistory: ShoppingItem[]
): Array<{ name: string; category: string; count: number }> => {
  const itemCounts = new Map<string, { category: string; count: number }>()
  
  purchaseHistory.forEach(item => {
    const key = item.name.toLowerCase()
    if (itemCounts.has(key)) {
      itemCounts.get(key)!.count++
    } else {
      itemCounts.set(key, { category: item.category, count: 1 })
    }
  })
  
  return Array.from(itemCounts.entries())
    .map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // רישיות ראשונה
      category: data.category,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count) // מסודר לפי פופולריות
    .filter(item => item.count >= 2) // רק מוצרים שנקנו לפחות פעמיים
}
