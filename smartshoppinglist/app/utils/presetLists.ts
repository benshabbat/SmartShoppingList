import { CATEGORIES, CategoryType } from './categories'
import { suggestCategoryForProduct } from './smartSuggestions'

// רשימות מוכנות מאורגנות ונקיות
export interface PresetList {
  title: string
  items: Array<{name: string, category: CategoryType}>
  icon?: string
  description?: string
}

export const PRESET_LISTS: Record<string, PresetList> = {
  breakfast: {
    title: 'ארוחת בוקר',
    icon: '🌅',
    description: 'כל מה שצריך לארוחת בוקר טעימה',
    items: [
      { name: 'חלב', category: CATEGORIES.DAIRY },
      { name: 'לחם', category: CATEGORIES.BREAD },
      { name: 'ביצים', category: CATEGORIES.DAIRY },
      { name: 'גבינה צהובה', category: CATEGORIES.DAIRY },
      { name: 'חמאה', category: CATEGORIES.DAIRY },
      { name: 'דבש', category: CATEGORIES.SWEETS },
      { name: 'בננה', category: CATEGORIES.FRUITS },
      { name: 'תפוח', category: CATEGORIES.FRUITS },
      { name: 'קפה', category: CATEGORIES.BEVERAGES },
      { name: 'יוגורט', category: CATEGORIES.DAIRY }
    ]
  },
  
  dinner: {
    title: 'ארוחת ערב',
    icon: '🍽️',
    description: 'מרכיבים לארוחת ערב מלאה',
    items: [
      { name: 'עוף', category: CATEGORIES.MEAT_FISH },
      { name: 'אורז', category: CATEGORIES.GRAINS },
      { name: 'עגבניות', category: CATEGORIES.VEGETABLES },
      { name: 'מלפפון', category: CATEGORIES.VEGETABLES },
      { name: 'בצל', category: CATEGORIES.VEGETABLES },
      { name: 'שמן זית', category: CATEGORIES.OILS_SPICES },
      { name: 'מלח', category: CATEGORIES.OILS_SPICES },
      { name: 'פלפל שחור', category: CATEGORIES.OILS_SPICES },
      { name: 'גזר', category: CATEGORIES.VEGETABLES },
      { name: 'תפוחי אדמה', category: CATEGORIES.VEGETABLES }
    ]
  },
  
  party: {
    title: 'מסיבה/אירוח',
    icon: '🎉',
    description: 'מוצרים לאירוח ומסיבות',
    items: [
      { name: 'צ\'יפס', category: CATEGORIES.SNACKS },
      { name: 'אגוזים', category: CATEGORIES.SNACKS },
      { name: 'קולה', category: CATEGORIES.BEVERAGES },
      { name: 'בירה', category: CATEGORIES.BEVERAGES },
      { name: 'חומוס', category: CATEGORIES.READY_MADE },
      { name: 'פיתה', category: CATEGORIES.BREAD },
      { name: 'שוקולד', category: CATEGORIES.SWEETS },
      { name: 'גלידה', category: CATEGORIES.FROZEN },
      { name: 'מיץ', category: CATEGORIES.BEVERAGES },
      { name: 'ביסקוויטים', category: CATEGORIES.SNACKS }
    ]
  },
  
  shabbat: {
    title: 'שבת',
    icon: '🕯️',
    description: 'מוצרים מיוחדים לשבת',
    items: [
      { name: 'יין', category: CATEGORIES.BEVERAGES },
      { name: 'חלה', category: CATEGORIES.BREAD },
      { name: 'דגים', category: CATEGORIES.MEAT_FISH },
      { name: 'תפוחי אדמה', category: CATEGORIES.VEGETABLES },
      { name: 'גזר', category: CATEGORIES.VEGETABLES },
      { name: 'בשר בקר', category: CATEGORIES.MEAT_FISH },
      { name: 'ממתקים', category: CATEGORIES.SWEETS },
      { name: 'סלט', category: CATEGORIES.VEGETABLES },
      { name: 'אורז', category: CATEGORIES.GRAINS },
      { name: 'מרק', category: CATEGORIES.READY_MADE }
    ]
  },
  
  healthy: {
    title: 'בריא',
    icon: '🥗',
    description: 'מוצרים בריאים ומזינים',
    items: [
      { name: 'קינואה', category: CATEGORIES.GRAINS },
      { name: 'אבוקדו', category: CATEGORIES.FRUITS },
      { name: 'שיבולת שועל', category: CATEGORIES.GRAINS },
      { name: 'יוגורט יווני', category: CATEGORIES.DAIRY },
      { name: 'אגוזים', category: CATEGORIES.SNACKS },
      { name: 'ברוקולי', category: CATEGORIES.VEGETABLES },
      { name: 'תרד', category: CATEGORIES.VEGETABLES },
      { name: 'תותים', category: CATEGORIES.FRUITS },
      { name: 'סלמון', category: CATEGORIES.MEAT_FISH },
      { name: 'זיתים', category: CATEGORIES.VEGETABLES }
    ]
  },
  
  basic: {
    title: 'בסיסי',
    icon: '🏠',
    description: 'מוצרי יסוד לבית',
    items: [
      { name: 'לחם', category: CATEGORIES.BREAD },
      { name: 'חלב', category: CATEGORIES.DAIRY },
      { name: 'ביצים', category: CATEGORIES.DAIRY },
      { name: 'אורז', category: CATEGORIES.GRAINS },
      { name: 'שמן', category: CATEGORIES.OILS_SPICES },
      { name: 'סוכר', category: CATEGORIES.SWEETS },
      { name: 'מלח', category: CATEGORIES.OILS_SPICES },
      { name: 'בצל', category: CATEGORIES.VEGETABLES },
      { name: 'עגבניות', category: CATEGORIES.VEGETABLES },
      { name: 'מים', category: CATEGORIES.BEVERAGES }
    ]
  }
}

// פונקציה ליצירת רשימה מותאמת אישית עם זיהוי חכם של קטגוריות
export const parseCustomList = (text: string): Array<{name: string, category: string}> => {
  if (!text.trim()) return []
  
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(item => item.length > 0)
    .map(item => ({
      name: item,
      category: suggestCategoryForProduct(item) // שימוש בפונקציה החכמה לזיהוי קטגוריות
    }))
}

// קבלת רשימת מפתחות
export const getPresetListKeys = (): string[] => {
  return Object.keys(PRESET_LISTS)
}

// קבלת רשימה לפי מפתח
export const getPresetList = (key: string): PresetList | null => {
  return PRESET_LISTS[key] || null
}
