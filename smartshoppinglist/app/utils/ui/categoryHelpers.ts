/**
 * Category Helper Functions
 * Utilities for handling shopping categories
 */

import { Category } from '../../types'

// Category to emoji mapping
const CATEGORY_EMOJIS: Record<string, string> = {
  'פירות וירקות': '🥬',
  'מוצרי חלב': '�',
  'בשר ודגים': '�',
  'לחם ומאפים': '🍞',
  'משקאות': '�',
  'חטיפים ומתוקים': '🍿',
  'מוצרי ניקיון': '�',
  'מוצרי היגיינה': '🧴',
  'מזון יבש': '🌾',
  'קפואים': '🧊',
  'שימורים ומוכנים': '🥫',
  'תבלינים ורטבים': '🧂',
  'מוצרי בריאות': '💊',
  'אלכוהול': '🍷',
  'מוצרי תינוקות': '🍼',
  'מוצרי חיות מחמד': '🐕',
  'אחר': '📦'
}

// Category display names (Hebrew)
const CATEGORY_NAMES: Record<string, string> = {
  'פירות וירקות': 'פירות וירקות',
  'מוצרי חלב': 'מוצרי חלב',
  'בשר ודגים': 'בשר ודגים',
  'לחם ומאפים': 'לחם ומאפים',
  'משקאות': 'משקאות',
  'חטיפים ומתוקים': 'חטיפים ומתוקים',
  'מוצרי ניקיון': 'מוצרי ניקיון',
  'מוצרי היגיינה': 'מוצרי היגיינה',
  'מזון יבש': 'מזון יבש',
  'קפואים': 'קפואים',
  'שימורים ומוכנים': 'שימורים ומוכנים',
  'תבלינים ורטבים': 'תבלינים ורטבים',
  'מוצרי בריאות': 'מוצרי בריאות',
  'אלכוהול': 'אלכוהול',
  'מוצרי תינוקות': 'מוצרי תינוקות',
  'מוצרי חיות מחמד': 'מוצרי חיות מחמד',
  'אחר': 'אחר'
}

// Product name to category mapping for smart suggestions
const PRODUCT_CATEGORY_MAP: Record<string, Category> = {
  // פירות וירקות
  'תפוח': 'פירות וירקות',
  'בננה': 'פירות וירקות',
  'תפוז': 'פירות וירקות',
  'עגבנייה': 'פירות וירקות',
  'מלפפון': 'פירות וירקות',
  'חסה': 'פירות וירקות',
  'בצל': 'פירות וירקות',
  'שום': 'פירות וירקות',
  'גזר': 'פירות וירקות',
  'תפוח אדמה': 'פירות וירקות',
  
  // בשר ודגים
  'עוף': 'בשר ודגים',
  'בקר': 'בשר ודגים',
  'דג': 'בשר ודגים',
  'סלמון': 'בשר ודגים',
  'טונה': 'בשר ודגים',
  
  // מוצרי חלב
  'חלב': 'מוצרי חלב',
  'ביצים': 'מוצרי חלב',
  'גבינה': 'מוצרי חלב',
  'יוגורט': 'מוצרי חלב',
  'חמאה': 'מוצרי חלב',
  'קוטג': 'מוצרי חלב',
  
  // לחם ומאפים
  'לחם': 'לחם ומאפים',
  'רולים': 'לחם ומאפים',
  'פיתה': 'לחם ומאפים',
  'חלה': 'לחם ומאפים',
  'עוגה': 'לחם ומאפים',
  
  // משקאות
  'מים': 'משקאות',
  'מיץ': 'משקאות',
  'קולה': 'משקאות',
  'בירה': 'משקאות',
  'יין': 'משקאות',
  'קפה': 'משקאות',
  'תה': 'משקאות',
  
  // מוצרי ניקיון
  'סבון': 'מוצרי ניקיון',
  'אבקת כביסה': 'מוצרי ניקיון',
  'מרכך': 'מוצרי ניקיון',
  'ספוגים': 'מוצרי ניקיון',
  'נייר טואלט': 'מוצרי ניקיון'
}

export const getCategoryEmoji = (category: string): string => {
  return CATEGORY_EMOJIS[category] || CATEGORY_EMOJIS['אחר']
}

export const getCategoryDisplayName = (category: string): string => {
  return CATEGORY_NAMES[category] || category
}

export const getAllCategories = (): Category[] => {
  return Object.keys(CATEGORY_NAMES) as Category[]
}

export const suggestCategoryFromProductName = (productName: string): Category | null => {
  const cleanName = productName.toLowerCase().trim()
  
  // Check exact matches first
  for (const [product, category] of Object.entries(PRODUCT_CATEGORY_MAP)) {
    if (cleanName.includes(product.toLowerCase())) {
      return category
    }
  }
  
  // Check partial matches for common words
  if (cleanName.includes('חלב') || cleanName.includes('גבינה') || cleanName.includes('יוגורט')) {
    return 'מוצרי חלב'
  }
  
  if (cleanName.includes('לחם') || cleanName.includes('רול') || cleanName.includes('פיתה')) {
    return 'לחם ומאפים'
  }
  
  if (cleanName.includes('עוף') || cleanName.includes('בשר') || cleanName.includes('דג')) {
    return 'בשר ודגים'
  }
  
  if (cleanName.includes('ירק') || cleanName.includes('פרי')) {
    return 'פירות וירקות'
  }
  
  if (cleanName.includes('ניקוי') || cleanName.includes('סבון') || cleanName.includes('אבקה')) {
    return 'מוצרי ניקיון'
  }
  
  if (cleanName.includes('שמפו') || cleanName.includes('משחת שיניים') || cleanName.includes('דאודורנט')) {
    return 'מוצרי היגיינה'
  }
  
  return null
}

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'פירות וירקות': 'bg-green-100 text-green-800',
    'מוצרי חלב': 'bg-blue-100 text-blue-800',
    'בשר ודגים': 'bg-red-100 text-red-800',
    'לחם ומאפים': 'bg-yellow-100 text-yellow-800',
    'משקאות': 'bg-cyan-100 text-cyan-800',
    'חטיפים ומתוקים': 'bg-pink-100 text-pink-800',
    'מוצרי ניקיון': 'bg-purple-100 text-purple-800',
    'מוצרי היגיינה': 'bg-teal-100 text-teal-800',
    'מזון יבש': 'bg-amber-100 text-amber-800',
    'קפואים': 'bg-indigo-100 text-indigo-800',
    'שימורים ומוכנים': 'bg-gray-100 text-gray-800',
    'תבלינים ורטבים': 'bg-orange-100 text-orange-800',
    'מוצרי בריאות': 'bg-emerald-100 text-emerald-800',
    'אלכוהול': 'bg-violet-100 text-violet-800',
    'מוצרי תינוקות': 'bg-rose-100 text-rose-800',
    'מוצרי חיות מחמד': 'bg-amber-100 text-amber-800',
    'אחר': 'bg-gray-100 text-gray-800'
  }
  
  return colors[category] || colors['אחר']
}

export const sortCategoriesByPriority = (categories: string[]): string[] => {
  const priority = [
    'פירות וירקות',
    'מוצרי חלב',
    'בשר ודגים', 
    'לחם ומאפים',
    'משקאות',
    'קפואים',
    'שימורים ומוכנים',
    'מזון יבש',
    'חטיפים ומתוקים',
    'תבלינים ורטבים',
    'מוצרי ניקיון',
    'מוצרי היגיינה',
    'מוצרי בריאות',
    'אלכוהול',
    'מוצרי תינוקות',
    'מוצרי חיות מחמד',
    'אחר'
  ]
  
  return categories.sort((a, b) => {
    const indexA = priority.indexOf(a)
    const indexB = priority.indexOf(b)
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })
}