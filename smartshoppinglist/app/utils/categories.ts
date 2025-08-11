// קבצי קטגוריות מאורגנים
export const CATEGORIES = {
  DAIRY: 'מוצרי חלב',
  MEAT_FISH: 'בשר ודגים',
  VEGETABLES: 'ירקות',
  FRUITS: 'פירות',
  BREAD: 'לחם ומאפים',
  GRAINS: 'דגנים',
  SWEETS: 'מתוקים',
  BEVERAGES: 'משקאות',
  SNACKS: 'חטיפים',
  READY_MADE: 'מוכן',
  FROZEN: 'קפואים',
  OILS_SPICES: 'שמנים ותבלינים',
  GENERAL: 'כללי'
} as const

export type CategoryType = typeof CATEGORIES[keyof typeof CATEGORIES]

// מפה של מילות מפתח לקטגוריות
export const CATEGORY_KEYWORDS: Record<string, CategoryType> = {
  // מוצרי חלב
  'חלב': CATEGORIES.DAIRY,
  'גבינה': CATEGORIES.DAIRY,
  'יוגורט': CATEGORIES.DAIRY,
  'ביצים': CATEGORIES.DAIRY,
  'חמאה': CATEGORIES.DAIRY,
  'שמנת': CATEGORIES.DAIRY,
  'קוטג': CATEGORIES.DAIRY,
  
  // בשר ודגים
  'עוף': CATEGORIES.MEAT_FISH,
  'בשר': CATEGORIES.MEAT_FISH,
  'דג': CATEGORIES.MEAT_FISH,
  'סלמון': CATEGORIES.MEAT_FISH,
  'טונה': CATEGORIES.MEAT_FISH,
  'כבש': CATEGORIES.MEAT_FISH,
  'חזיר': CATEGORIES.MEAT_FISH,
  
  // ירקות
  'עגבני': CATEGORIES.VEGETABLES,
  'מלפפון': CATEGORIES.VEGETABLES,
  'בצל': CATEGORIES.VEGETABLES,
  'גזר': CATEGORIES.VEGETABLES,
  'תפוח אדמה': CATEGORIES.VEGETABLES,
  'פלפל ירוק': CATEGORIES.VEGETABLES,
  'חסה': CATEGORIES.VEGETABLES,
  'סלרי': CATEGORIES.VEGETABLES,
  
  // פירות
  'תפוח': CATEGORIES.FRUITS,
  'בננה': CATEGORIES.FRUITS,
  'תפוז': CATEGORIES.FRUITS,
  'אגס': CATEGORIES.FRUITS,
  'אבטיח': CATEGORIES.FRUITS,
  'מלון': CATEGORIES.FRUITS,
  'ענבים': CATEGORIES.FRUITS,
  'תות': CATEGORIES.FRUITS,
  
  // לחם ומאפים
  'לחם': CATEGORIES.BREAD,
  'חלה': CATEGORIES.BREAD,
  'פיתה': CATEGORIES.BREAD,
  'בגט': CATEGORIES.BREAD,
  'עוגה': CATEGORIES.BREAD,
  'מאפה': CATEGORIES.BREAD,
  
  // דגנים
  'אורז': CATEGORIES.GRAINS,
  'פסטה': CATEGORIES.GRAINS,
  'בורגול': CATEGORIES.GRAINS,
  'קינואה': CATEGORIES.GRAINS,
  'שיבולת שועל': CATEGORIES.GRAINS,
  
  // מתוקים
  'שוקולד': CATEGORIES.SWEETS,
  'ממתק': CATEGORIES.SWEETS,
  'דבש': CATEGORIES.SWEETS,
  'סוכר': CATEGORIES.SWEETS,
  'ריבה': CATEGORIES.SWEETS,
  
  // משקאות
  'מים': CATEGORIES.BEVERAGES,
  'יין': CATEGORIES.BEVERAGES,
  'בירה': CATEGORIES.BEVERAGES,
  'קולה': CATEGORIES.BEVERAGES,
  'מיץ': CATEGORIES.BEVERAGES,
  'קפה': CATEGORIES.BEVERAGES,
  'תה': CATEGORIES.BEVERAGES,
  
  // שמנים ותבלינים
  'שמן': CATEGORIES.OILS_SPICES,
  'מלח': CATEGORIES.OILS_SPICES,
  'פלפל שחור': CATEGORIES.OILS_SPICES,
  'קינמון': CATEGORIES.OILS_SPICES,
  'כמון': CATEGORIES.OILS_SPICES,
  'כורכום': CATEGORIES.OILS_SPICES
}

// פונקציה לזיהוי קטגוריה אוטומטית
export const detectCategory = (itemName: string): CategoryType => {
  const lowerItem = itemName.toLowerCase()
  
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lowerItem.includes(keyword.toLowerCase())) {
      return category
    }
  }
  
  return CATEGORIES.GENERAL
}

// קבלת כל הקטגוריות כרשימה
export const getAllCategories = (): CategoryType[] => {
  return Object.values(CATEGORIES)
}
