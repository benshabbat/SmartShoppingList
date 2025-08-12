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

// מפה של מילות מפתח לקטגוריות - מורחבת
export const CATEGORY_KEYWORDS: Record<string, CategoryType> = {
  // מוצרי חלב
  'חלב': CATEGORIES.DAIRY,
  'גבינה': CATEGORIES.DAIRY,
  'יוגורט': CATEGORIES.DAIRY,
  'ביצים': CATEGORIES.DAIRY,
  'חמאה': CATEGORIES.DAIRY,
  'שמנת': CATEGORIES.DAIRY,
  'קוטג': CATEGORIES.DAIRY,
  'לבנה': CATEGORIES.DAIRY,
  'משקה חלב': CATEGORIES.DAIRY,
  'מוצרלה': CATEGORIES.DAIRY,
  'פטה': CATEGORIES.DAIRY,
  'חלב קוקוס': CATEGORIES.DAIRY,
  'קרם': CATEGORIES.DAIRY,
  'צ\'דר': CATEGORIES.DAIRY,
  'אמנטל': CATEGORIES.DAIRY,
  'גאודה': CATEGORIES.DAIRY,
  'פרמזן': CATEGORIES.DAIRY,
  'ריקוטה': CATEGORIES.DAIRY,
  'קפיר': CATEGORIES.DAIRY,
  'ביצה': CATEGORIES.DAIRY,
  'ביצי': CATEGORIES.DAIRY,
  
  // בשר ודגים
  'עוף': CATEGORIES.MEAT_FISH,
  'בשר': CATEGORIES.MEAT_FISH,
  'דג': CATEGORIES.MEAT_FISH,
  'סלמון': CATEGORIES.MEAT_FISH,
  'טונה': CATEGORIES.MEAT_FISH,
  'כבש': CATEGORIES.MEAT_FISH,
  'בקר': CATEGORIES.MEAT_FISH,
  'הודו': CATEGORIES.MEAT_FISH,
  'נקניק': CATEGORIES.MEAT_FISH,
  'נתחי': CATEGORIES.MEAT_FISH,
  'כרעיים': CATEGORIES.MEAT_FISH,
  'חזה': CATEGORIES.MEAT_FISH,
  'פילה': CATEGORIES.MEAT_FISH,
  'קציצות': CATEGORIES.MEAT_FISH,
  'שניצל': CATEGORIES.MEAT_FISH,
  'המבורגר': CATEGORIES.MEAT_FISH,
  'פסטרמה': CATEGORIES.MEAT_FISH,
  'כנפיים': CATEGORIES.MEAT_FISH,
  'שוקיים': CATEGORIES.MEAT_FISH,
  'אנטריקוט': CATEGORIES.MEAT_FISH,
  'סטייק': CATEGORIES.MEAT_FISH,
  'בקלה': CATEGORIES.MEAT_FISH,
  'דניס': CATEGORIES.MEAT_FISH,
  'מוסר': CATEGORIES.MEAT_FISH,
  'דגים': CATEGORIES.MEAT_FISH,
  
  // ירקות
  'עגבני': CATEGORIES.VEGETABLES,
  'מלפפון': CATEGORIES.VEGETABLES,
  'בצל': CATEGORIES.VEGETABLES,
  'גזר': CATEGORIES.VEGETABLES,
  'תפוח אדמה': CATEGORIES.VEGETABLES,
  'פלפל ירוק': CATEGORIES.VEGETABLES,
  'פלפל אדום': CATEGORIES.VEGETABLES,
  'חסה': CATEGORIES.VEGETABLES,
  'סלרי': CATEGORIES.VEGETABLES,
  'ברוקולי': CATEGORIES.VEGETABLES,
  'כרוב': CATEGORIES.VEGETABLES,
  'תרד': CATEGORIES.VEGETABLES,
  'קישוא': CATEGORIES.VEGETABLES,
  'חציל': CATEGORIES.VEGETABLES,
  'דלעת': CATEGORIES.VEGETABLES,
  'פטרוזיליה': CATEGORIES.VEGETABLES,
  'שום': CATEGORIES.VEGETABLES,
  'ירק': CATEGORIES.VEGETABLES,
  'סלט': CATEGORIES.VEGETABLES,
  'עדשים': CATEGORIES.VEGETABLES,
  'חומוס גרגירים': CATEGORIES.VEGETABLES,
  'עגבניות': CATEGORIES.VEGETABLES,
  'מלפפונים': CATEGORIES.VEGETABLES,
  'גזרים': CATEGORIES.VEGETABLES,
  'פלפלים': CATEGORIES.VEGETABLES,
  'ירקות': CATEGORIES.VEGETABLES,
  'בטטה': CATEGORIES.VEGETABLES,
  'בטטות': CATEGORIES.VEGETABLES,
  'תפו"א': CATEGORIES.VEGETABLES,
  'תפוחי אדמה': CATEGORIES.VEGETABLES,
  
  // פירות
  'תפוח': CATEGORIES.FRUITS,
  'בננה': CATEGORIES.FRUITS,
  'תפוז': CATEGORIES.FRUITS,
  'אגס': CATEGORIES.FRUITS,
  'אבטיח': CATEGORIES.FRUITS,
  'מלון': CATEGORIES.FRUITS,
  'ענבים': CATEGORIES.FRUITS,
  'תות': CATEGORIES.FRUITS,
  'אבוקדו': CATEGORIES.FRUITS,
  'מנגו': CATEGORIES.FRUITS,
  'קיווי': CATEGORIES.FRUITS,
  'רימון': CATEGORIES.FRUITS,
  'לימון': CATEGORIES.FRUITS,
  'אשכולית': CATEGORIES.FRUITS,
  'דובדבנים': CATEGORIES.FRUITS,
  'אפרסק': CATEGORIES.FRUITS,
  'נקטרינה': CATEGORIES.FRUITS,
  'שזיף': CATEGORIES.FRUITS,
  'פרי': CATEGORIES.FRUITS,
  'תפוחים': CATEGORIES.FRUITS,
  'בננות': CATEGORIES.FRUITS,
  'תפוזים': CATEGORIES.FRUITS,
  'אגסים': CATEGORIES.FRUITS,
  'פירות': CATEGORIES.FRUITS,
  'תותים': CATEGORIES.FRUITS,
  'דובדבן': CATEGORIES.FRUITS,
  'אפרסקים': CATEGORIES.FRUITS,
  'שזיפים': CATEGORIES.FRUITS,
  'קלמנטינה': CATEGORIES.FRUITS,
  'קלמנטינות': CATEGORIES.FRUITS,
  
  // לחם ומאפים
  'לחם': CATEGORIES.BREAD,
  'חלה': CATEGORIES.BREAD,
  'פיתה': CATEGORIES.BREAD,
  'בגט': CATEGORIES.BREAD,
  'עוגה': CATEGORIES.BREAD,
  'מאפה': CATEGORIES.BREAD,
  'טוסט': CATEGORIES.BREAD,
  'לחמניה': CATEGORIES.BREAD,
  'כיכר': CATEGORIES.BREAD,
  'בריוש': CATEGORIES.BREAD,
  'קרקר': CATEGORIES.BREAD,
  'ביסקוויט': CATEGORIES.BREAD,
  'עוגיות': CATEGORIES.BREAD,
  
  // דגנים
  'אורז': CATEGORIES.GRAINS,
  'פסטה': CATEGORIES.GRAINS,
  'בורגול': CATEGORIES.GRAINS,
  'קינואה': CATEGORIES.GRAINS,
  'שיבולת שועל': CATEGORIES.GRAINS,
  'קוסקוס': CATEGORIES.GRAINS,
  'חיטה': CATEGORIES.GRAINS,
  'שעורה': CATEGORIES.GRAINS,
  'כוסמת': CATEGORIES.GRAINS,
  'דגן': CATEGORIES.GRAINS,
  
  // מתוקים
  'שוקולד': CATEGORIES.SWEETS,
  'ממתק': CATEGORIES.SWEETS,
  'דבש': CATEGORIES.SWEETS,
  'סוכר': CATEGORIES.SWEETS,
  'ריבה': CATEGORIES.SWEETS,
  'סירופ': CATEGORIES.SWEETS,
  'ממרח': CATEGORIES.SWEETS,
  'נוטלה': CATEGORIES.SWEETS,
  'עוגיה': CATEGORIES.SWEETS,
  'במבה': CATEGORIES.SWEETS,
  'סוכריות': CATEGORIES.SWEETS,
  
  // משקאות
  'מים': CATEGORIES.BEVERAGES,
  'יין': CATEGORIES.BEVERAGES,
  'בירה': CATEGORIES.BEVERAGES,
  'קולה': CATEGORIES.BEVERAGES,
  'מיץ': CATEGORIES.BEVERAGES,
  'קפה': CATEGORIES.BEVERAGES,
  'תה': CATEGORIES.BEVERAGES,
  'משקה': CATEGORIES.BEVERAGES,
  'מי סודה': CATEGORIES.BEVERAGES,
  'פאנטה': CATEGORIES.BEVERAGES,
  'אנרגיה': CATEGORIES.BEVERAGES,
  'וודקה': CATEGORIES.BEVERAGES,
  'וויסקי': CATEGORIES.BEVERAGES,
  
  // חטיפים
  'צ\'יפס': CATEGORIES.SNACKS,
  'אגוזים': CATEGORIES.SNACKS,
  'בוטנים': CATEGORIES.SNACKS,
  'קשיו': CATEGORIES.SNACKS,
  'שקדים': CATEGORIES.SNACKS,
  'פיסטוק': CATEGORIES.SNACKS,
  'פתיתים': CATEGORIES.SNACKS,
  'חטיף': CATEGORIES.SNACKS,
  'מלוחים': CATEGORIES.SNACKS,
  
  // שמנים ותבלינים
  'שמן': CATEGORIES.OILS_SPICES,
  'מלח': CATEGORIES.OILS_SPICES,
  'פלפל שחור': CATEGORIES.OILS_SPICES,
  'קינמון': CATEGORIES.OILS_SPICES,
  'כמון': CATEGORIES.OILS_SPICES,
  'כורכום': CATEGORIES.OILS_SPICES,
  'אורגנו': CATEGORIES.OILS_SPICES,
  'בזיליקום': CATEGORIES.OILS_SPICES,
  'פפריקה': CATEGORIES.OILS_SPICES,
  'חומץ': CATEGORIES.OILS_SPICES,
  'תבלין': CATEGORIES.OILS_SPICES,
  'חרדל': CATEGORIES.OILS_SPICES,
  'קטשופ': CATEGORIES.OILS_SPICES,
  'מיונז': CATEGORIES.OILS_SPICES,
  
  // מוכן
  'חומוס': CATEGORIES.READY_MADE,
  'סלט מוכן': CATEGORIES.READY_MADE,
  'מרק': CATEGORIES.READY_MADE,
  'קופסיות שימורים': CATEGORIES.READY_MADE,
  'שימורים': CATEGORIES.READY_MADE,
  'מוכן': CATEGORIES.READY_MADE,
  'רוטב': CATEGORIES.READY_MADE,
  'פלאפל': CATEGORIES.READY_MADE,
  'טביט': CATEGORIES.READY_MADE,
  'טחינה': CATEGORIES.READY_MADE,
  'חרוסת': CATEGORIES.READY_MADE,
  'זיתים': CATEGORIES.READY_MADE,
  'מלפפונים חמוצים': CATEGORIES.READY_MADE,
  
  // קפואים
  'גלידה': CATEGORIES.FROZEN,
  'ירקות קפואים': CATEGORIES.FROZEN,
  'פירות קפואים': CATEGORIES.FROZEN,
  'קפוא': CATEGORIES.FROZEN,
  'בורקס': CATEGORIES.FROZEN,
  'פיצה קפואה': CATEGORIES.FROZEN,
  'שניצל קפוא': CATEGORIES.FROZEN,
  'דגים קפואים': CATEGORIES.FROZEN,
  'עוף קפוא': CATEGORIES.FROZEN,
  'לזניה קפואה': CATEGORIES.FROZEN,
  'סורבה': CATEGORIES.FROZEN,
  'פירות יער קפואים': CATEGORIES.FROZEN
}

// פונקציה לזיהוי קטגוריה אוטומטית משופרת
export const detectCategory = (itemName: string): CategoryType => {
  const lowerItem = itemName.toLowerCase().trim()
  
  // חיפוש ישיר לפי מילות מפתח
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lowerItem.includes(keyword.toLowerCase())) {
      return category
    }
  }
  
  // חיפוש חלקי - מילים שיכולות להופיע בתוך שמות מוצרים
  const partialMatches = [
    { patterns: ['חלב', 'גבינ', 'יוגור', 'ביצ', 'חמא'], category: CATEGORIES.DAIRY },
    { patterns: ['עוף', 'בשר', 'דג', 'כבש', 'בקר', 'הוד', 'נקניק'], category: CATEGORIES.MEAT_FISH },
    { patterns: ['עגבנ', 'מלפפ', 'בצל', 'גזר', 'תפוח אדמ', 'פלפל', 'חס', 'ברוק', 'כרוב'], category: CATEGORIES.VEGETABLES },
    { patterns: ['תפוח', 'בנאנ', 'תפוז', 'אגס', 'אבטיח', 'מלון', 'ענב', 'תות', 'מנגו'], category: CATEGORIES.FRUITS },
    { patterns: ['לחם', 'חל', 'פית', 'בגט', 'עוג', 'מאפ', 'טוסט'], category: CATEGORIES.BREAD },
    { patterns: ['אורז', 'פסט', 'בורג', 'קינו', 'שיבול', 'קוסק'], category: CATEGORIES.GRAINS },
    { patterns: ['שוקול', 'ממתק', 'דבש', 'סוכר', 'ריב', 'נוטל'], category: CATEGORIES.SWEETS },
    { patterns: ['מים', 'יין', 'ביר', 'קול', 'מיץ', 'קפה', 'משק'], category: CATEGORIES.BEVERAGES },
    { patterns: ['צ\'יפס', 'אגוז', 'בוטנ', 'חטיף', 'פתית'], category: CATEGORIES.SNACKS },
    { patterns: ['שמן', 'מלח', 'פלפל', 'תבלין', 'חומץ'], category: CATEGORIES.OILS_SPICES },
  ]
  
  for (const { patterns, category } of partialMatches) {
    for (const pattern of patterns) {
      if (lowerItem.includes(pattern)) {
        return category
      }
    }
  }
  
  // אם לא נמצא התאמה, החזר קטגוריה כללית
  return CATEGORIES.GENERAL
}

// קבלת כל הקטגוריות כרשימה
export const getAllCategories = (): CategoryType[] => {
  return Object.values(CATEGORIES)
}
