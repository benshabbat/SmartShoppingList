import { Category } from '../types'

/**
 * Consolidated constants file - DRY principles applied
 */

// Environment
export const ENV_CONSTANTS = {
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const

// Time constants
export const TIME_CONSTANTS = {
  NOTIFICATION_TIMEOUT: 3000,
  ANIMATION_DELAY_BASE: 100,
  EXPIRY_WARNING_DAYS: 3,
  WEEK_IN_DAYS: 7,
  TWO_WEEKS_IN_DAYS: 14,
} as const

// UI Constants
export const UI_CONSTANTS = {
  MIN_PRODUCT_NAME_LENGTH: 2,
  MAX_PRODUCT_NAME_LENGTH: 50,
  MAX_TUTORIAL_STEPS: 6,
  DEFAULT_PAGE_SIZE: 10,
} as const

// CSS Constants
export const CSS_CONSTANTS = {
  BORDER_RADIUS: {
    SMALL: 'rounded-lg',
    MEDIUM: 'rounded-xl',
    LARGE: 'rounded-2xl',
  },
  SHADOW: {
    SMALL: 'shadow-sm',
    MEDIUM: 'shadow-md',
    LARGE: 'shadow-lg',
    EXTRA_LARGE: 'shadow-xl',
    EXTRA_EXTRA_LARGE: 'shadow-2xl',
  },
  SPACING: {
    SMALL: 'p-2',
    MEDIUM: 'p-4',
    LARGE: 'p-6',
    EXTRA_LARGE: 'p-8',
  },
  GAP: {
    SMALL: 'gap-2',
    MEDIUM: 'gap-4',
    LARGE: 'gap-6',
  },
} as const

// Color schemes
export const COLOR_SCHEMES = {
  PRIMARY: 'from-indigo-500 to-purple-600',
  SUCCESS: 'from-green-500 to-emerald-600',
  WARNING: 'from-amber-500 to-orange-600',
  DANGER: 'from-red-500 to-pink-600',
  INFO: 'from-blue-500 to-indigo-600',
} as const

// Consolidated messages
export const MESSAGES = {
  SUCCESS: {
    ITEM_ADDED: (itemName: string) => `הפריט "${itemName}" נוסף לרשימה`,
    ITEM_ADDED_TO_CART: (itemName: string) => `הפריט "${itemName}" נוסף ישירות לסל`,
    ITEM_REMOVED: (itemName: string) => `הפריט "${itemName}" הוסר מהרשימה`,
    ITEM_UPDATED: (itemName: string) => `הפריט "${itemName}" עודכן`,
    ADDED_TO_CART: (itemName: string) => `${itemName} נוסף לסל`,
    REMOVED_FROM_CART: (itemName: string) => `${itemName} הוסר מהסל`,
    PURCHASE_COMPLETED: () => 'הקנייה הושלמה בהצלחה!',
    ITEMS_CLEARED: (count: number, type: string) => `${count} פריטים ${type} נמחקו`,
    BULK_ADDED: (count: number) => `נוספו ${count} פריטים לרשימה`,
    BULK_ADDED_TO_CART: (count: number) => `נוספו ${count} פריטים לעגלה`,
    RECEIPT_SCANNED: (count: number, storeName: string) => `נסרקו ${count} פריטים מ-${storeName}`,
    CART_CLEARED: (count: number) => `${count} פריטים הוחזרו לרשימת הקניות`,
    LIST_CREATED: () => 'רשימה נוצרה!',
  },
  ERROR: {
    ITEM_NAME_REQUIRED: () => 'שם הפריט חובה',
    ITEM_NAME_TOO_SHORT: () => 'שם הפריט חייב להכיל לפחות 2 תווים',
    ITEM_NAME_TOO_LONG: () => 'שם הפריט לא יכול להכיל יותר מ-50 תווים',
    CATEGORY_REQUIRED: () => 'קטגוריה חובה',
    DUPLICATE_ITEM: (itemName: string) => `הפריט "${itemName}" כבר קיים ברשימה`,
    ITEM_NOT_FOUND: () => 'הפריט לא נמצא',
    ADD_ITEM_FAILED: () => 'שגיאה בהוספת הפריט',
    UPDATE_ITEM_FAILED: () => 'שגיאה בעדכון הפריט',
    DELETE_ITEM_FAILED: () => 'שגיאה במחיקת הפריט',
    EMPTY_CART: () => 'הסל ריק',
    NO_ITEMS_TO_PURCHASE: () => 'אין מוצרים בסל לקנייה',
    INVALID_NAME: () => 'שם המוצר לא תקין',
    NAME_TOO_SHORT: () => 'שם המוצר קצר מדי',
    NAME_TOO_LONG: () => 'שם המוצר ארוך מדי',
    PRODUCT_EXISTS: () => 'המוצר כבר קיים ברשימה',
    PURCHASE_FAILED: () => 'שגיאה בהשלמת הקנייה',
    CLEAR_CART_FAILED: () => 'שגיאה בניקוי הסל',
    CONNECTION_ERROR: () => 'בעיית התקשרות',
    GENERIC_ERROR: () => 'אירעה שגיאה',
    VALIDATION_ERROR: () => 'שגיאת אימות',
    RECEIPT_SCAN_FAILED: () => 'נכשל בסריקת הקבלה',
    NETWORK_ERROR: () => 'שגיאת רשת',
    SERVER_ERROR: () => 'שגיאת שרת',
  },
  WARNING: {
    EXPIRY_SOON: (itemName: string, days: number) => `${itemName} יפוג תוך ${days} ימים`,
    EXPIRY_TODAY: (itemName: string) => `${itemName} פג היום!`,
    EXPIRY_PAST: (itemName: string) => `${itemName} פג!`,
    CONFIRM_DELETE_ALL: () => 'האם למחוק את כל הפריטים?',
    CONFIRM_CLEAR_CART: () => 'האם להחזיר את כל הפריטים לרשימה?',
    UNSAVED_CHANGES: () => 'יש שינויים שלא נשמרו',
    LOW_STOCK: (itemName: string) => `מלאי נמוך: ${itemName}`,
  },
  INFO: {
    LOADING: () => 'טוען...',
    NO_ITEMS: () => 'אין פריטים ברשימה',
    NO_ITEMS_IN_CART: () => 'אין פריטים בסל',
    SEARCH_NO_RESULTS: () => 'לא נמצאו תוצאות',
    GUEST_MODE: () => 'מצב אורח - השינויים לא יישמרו',
    TUTORIAL_WELCOME: () => 'ברוכים הבאים לרשימת הקניות החכמה!',
    TUTORIAL_STEP: (step: number, total: number) => `שלב ${step} מתוך ${total}`,
  },
} as const

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
  'שימורים ומוכנים',
  'תבלינים ורטבים',
  'מוצרי בריאות',
  'אלכוהול',
  'מוצרי תינוקות',
  'מוצרי חיות מחמד',
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
  'שימורים ומוכנים': '🥫',
  'תבלינים ורטבים': '🧂',
  'מוצרי בריאות': '💊',
  'אלכוהול': '🍷',
  'מוצרי תינוקות': '🍼',
  'מוצרי חיות מחמד': '🐕',
  'אחר': '📦'
}

export const STORAGE_KEYS = {
  SHOPPING_LIST: 'shoppingList',
  SHOPPING_DATA: 'shoppingData',
  PURCHASE_HISTORY: 'purchaseHistory',
  PANTRY_ITEMS: 'pantryItems',
  LAST_VISIT: 'lastVisit'
} as const

// רשימת מוצרים נפוצים להשלמה אוטומטית
export const COMMON_PRODUCTS: Record<Category, string[]> = {
  'פירות וירקות': [
    'תפוחים', 'בננות', 'תפוזים', 'עגבניות', 'מלפפונים',
    'גזר', 'בצל', 'שום', 'פלפל', 'חסה', 'תרד', 'בטטה',
    'תפוחי אדמה', 'ברוקולי', 'כרובית', 'קישואים', 'לימונים',
    'אבוקדו', 'ענבים', 'אפרסקים', 'אגס', 'דובדבנים',
    'תות שדה', 'פטרוזיליה', 'כוסברה', 'נענע', 'בזיליקום',
    'רוקט', 'אנדיב', 'סלרי', 'צנון', 'קולרבי', 'פטל',
    'אוכמניות', 'מלון', 'אבטיח', 'קיווי', 'מנגו', 'אננס',
    'רימון', 'גויאבה', 'פומלו', 'אשכולית', 'קלמנטינות',
    'חציל', 'דלעת', 'תירס', 'ארטישוק', 'אספרגוס',
    'שעועית ירוקה', 'בצל ירוק', 'שמיר', 'כרישה', 'פנדר'
  ],
  'מוצרי חלב': [
    'חלב', 'גבינה צהובה', 'גבינה לבנה', 'יוגורט', 'חמאה',
    'שמנת', 'גבינת קוטג\'', 'גבינת מוצרלה', 'גבינת פטה',
    'ביצים', 'חלב שקדים', 'חלב קוקוס', 'גבינה קשה',
    'גבינת שמנת', 'יוגורט יווני', 'חלב סויה', 'חלב שיבולת שועל',
    'גבינת צ\'דר', 'גבינת אמנטל', 'גבינת גאודה', 'גבינת רוקפורט',
    'גבינת פרמזן', 'גבינת ברי', 'מסקרפונה', 'ריקוטה',
    'יוגורט דל שומן', 'יוגורט פרוביוטי', 'קפיר', 'לבנה',
    'שמנת חמוצה', 'קרם פרש', 'חלב מרוכז', 'חלב מתוק',
    'גלידת וניל', 'גלידת שוקולד', 'חמאת בוטנים', 'קוורק'
  ],
  'בשר ודגים': [
    'עוף שלם', 'חזה עוף', 'כרעי עוף', 'בשר בקר טחון',
    'אנטריקוט', 'סטייק', 'כבש', 'נקניקיות', 'נתחי דג',
    'סלמון', 'טונה', 'דג לבן', 'בקלה', 'סרדינים',
    'חמסה', 'מוסר', 'דניס', 'כנפי עוף', 'שוקי עוף',
    'הודו טרי', 'בשר חזיר', 'טלה', 'בשר עגל', 'כבד עוף',
    'לב עוף', 'קציצות', 'שניצל', 'מטבוחה', 'מרגז',
    'סטייק אנטריקוט', 'רוסטביף', 'בשר לקובה', 'בשר לתבשיל',
    'דג פורל', 'דג ברבוניה', 'דג מקרל', 'קרפיון', 'לברק',
    'מנות בשר מוכנות', 'המבורגר', 'קבב', 'מרמיטקו',
    'נקניק מעושן', 'נקניק חריף', 'פסטרמה', 'קורנד ביף'
  ],
  'לחם ומאפים': [
    'לחם לבן', 'לחם מלא', 'חלה', 'פיתה', 'לחמניות',
    'בגט', 'קרקרים', 'מצות', 'לחם דל גלוטן',
    'עוגיות', 'קרואסון', 'מאפה גבינה', 'בורקס',
    'לחם כוסמין', 'לחם שיפון', 'לחם טחינה', 'לחם זיתים',
    'טוסט לבן', 'טוסט מלא', 'לחמנייה המבורגר', 'פיתה שלמה',
    'לחם פוקצ\'ה', 'לחם סורדו', 'לחם ביס', 'לחם פומפרניקל',
    'מאפה שמרים', 'מאפה שקדים', 'רולדה', 'דניש',
    'מפין', 'קאפקייק', 'וופל בלגי', 'פנקייק מיקס',
    'בריוש', 'צ\'לה', 'ביגלה', 'פרנה', 'נאן', 'לפה'
  ],
  'משקאות': [
    'מים', 'מיץ תפוזים', 'קולה', 'בירה', 'יין',
    'קפה', 'תה', 'מיץ ענבים', 'מיץ תפוחים', 'סודה',
    'מים מוגזים', 'אנרגיה', 'מיץ גזר', 'לימונדה',
    'מיץ אננס', 'מיץ קרנברי', 'מיץ רימון', 'מיץ גויאבה',
    'תה ירוק', 'תה שחור', 'תה צמחים', 'קפה נמס', 'אספרסו',
    'קפוצ\'ינו', 'לאטה', 'מוקה', 'משקה איזוטוני', 'קומבוצ\'ה',
    'מים בטעמים', 'משקה סויה', 'משקה שקדים', 'איס טי',
    'שייק חלבון', 'משקה אנרגיה', 'סמותי', 'מילק שייק',
    'פאנטה', 'ספרייט', 'משקה ג\'ינג\'ר', 'טוניק', 'גזוז'
  ],
  'חטיפים ומתוקים': [
    'שוקולד', 'ביסקוויטים', 'חטיפי דגנים', 'אגוזים',
    'בוטנים', 'צימוקים', 'גומי דובים', 'ממתקים',
    'שוקולד חלב', 'שוקולד מריר', 'וופל', 'חטיף אנרגיה',
    'שקדים', 'אגוזי מלך', 'פיסטוקים', 'קשיו', 'פקאן',
    'תמרים', 'משמש יבש', 'חטיף גרנולה', 'חטיף חלבון',
    'פופקורן', 'צ\'יפס', 'בייגלה', 'פתיתי תירס',
    'במבה', 'ביסלי', 'דורידוס', 'חטיף אורז', 'קרקר מלוח',
    'עוגיות שוקולד צ\'יפס', 'עוגיות אוראו', 'עוגיות דיגסטיב',
    'הלווה', 'נוגט', 'מרמלדה', 'דבש', 'סירופ מייפל',
    'ממרח שוקולד', 'נוטלה', 'ריבה', 'ג\'ל פירות'
  ],
  'מוצרי ניקיון': [
    'סבון כלים', 'נוזל רצפות', 'אבקת כביסה', 'מרכך כביסה',
    'אקונומיקה', 'נייר טואלט', 'מגבונים', 'ניקוי זכוכית',
    'אקונומיקה לשירותים', 'שקיות זבל', 'מטליות ניקוי',
    'ספוגים', 'מברשת שירותים', 'נוזל לניקוי כללי',
    'אבקת אפייה לניקוי', 'חומץ לניקוי', 'נוזל לכביסה עדינה',
    'מסיר כתמים', 'אקונומיקה ג\'ל', 'ניקוי תנורים',
    'ניקוי מקרר', 'ניקוי אמבטיה', 'מסיר אבנית', 'מלח כביסה',
    'כדורי כביסה', 'מטליות מיקרופייבר', 'שקיות שואב אבק',
    'מטליות רטובות', 'נקי 10', 'אקונומיקה כלורית',
    'מכשיר ניקוי', 'נייר מגבת', 'מברשת נעליים'
  ],
  'מוצרי היגיינה': [
    'משחת שיניים', 'מברשת שיניים', 'שמפו', 'מרכך שיער',
    'סבון רחצה', 'דאודורנט', 'קרם גוף', 'תחבושות',
    'מגני הגלחה', 'קרם גילוח', 'מסכת פנים',
    'מי פה', 'חוט דנטלי', 'אקונומיקה פה', 'מעדן שפתיים',
    'קרם לחות', 'קרם ידיים', 'קרם פנים', 'קרם ג\'ל',
    'ג\'ל רחצה', 'שמן רחצה', 'מסיר איפור', 'טוניק',
    'סרום פנים', 'קרם עיניים', 'מסכה', 'פילינג',
    'תחבושות אלסטיות', 'פלסטר', 'משכך כאבים', 'ויטמינים',
    'מגבות נייר', 'תחבושות סטריליות', 'צמר גפן', 'אלכוהול',
    'יוד', 'מפמין', 'קרם שיזוף', 'קרם הגנה', 'קולון'
  ],
  'מזון יבש': [
    'אורז', 'פסטה', 'עדשים', 'חומוס', 'שעועית',
    'קמח', 'סוכר', 'מלח', 'שמן זית', 'שמן חמניות',
    'קינואה', 'בורגול', 'כוסמת', 'קוקוס מגורד',
    'שקדים', 'אגוזי מלך', 'פיסטוקים',
    'אורז יסמין', 'אורז מלא', 'אורז ארבוריו', 'פסטה מלאה',
    'פסטה ללא גלוטן', 'נודלס', 'קוסקוס', 'שיבולת שועל',
    'דגני בוקר', 'קורנפלקס', 'מוזלי', 'גרנולה',
    'קמח מלא', 'קמח שקדים', 'קמח קוקוס', 'סוכר חום',
    'דבש', 'סירופ אגבה', 'שמן קוקוס', 'שמן שומשום',
    'זרעי חמניות', 'זרעי דלעת', 'זרעי צ\'יה', 'זרעי פשתן',
    'שעועית אדומה', 'שעועית שחורה', 'עדשים אדומות',
    'אפונה יבשה', 'חומוס יבש', 'פול', 'כדורי מצה'
  ],
  'קפואים': [
    'ירקות קפואים', 'דגים קפואים', 'גלידה', 'פיצה קפואה',
    'עוף קפוא', 'פירות קפואים', 'שניצל קפוא',
    'חטיפים קפואים', 'ברוקולי קפוא', 'אפונה קפואה',
    'תירס קפוא', 'תערובת ירקות', 'תות קפוא', 'מנגו קפוא',
    'אבטיח קפוא', 'גלידת וניל', 'גלידת שוקולד', 'גלידה ביתית',
    'סורבה', 'פירות יער קפואים', 'בורקס קפוא', 'מלוח קפוא',
    'פלאפל קפוא', 'קציצות קפואות', 'המבורגר קפוא',
    'חטיפי גבינה קפואים', 'לזניה קפואה', 'נקניקיות קפואות',
    'דגי סלמון קפואים', 'שרימפס קפוא', 'צ\'יפס קפוא',
    'אפונה וגזר קפואים', 'תחליפי בשר קפואים'
  ],
  'שימורים ומוכנים': [
    'טונה משומרת', 'תירס משומר', 'עגבניות משומרות', 'פתרון מוכן',
    'מרק שקיות', 'רוטב עגבניות', 'חומוס מוכן', 'טחינה',
    'חרוסת', 'סלט ירקות משומר', 'זיתים', 'מלפפונים חמוצים',
    'סרדינים משומרים', 'סלמון משומר', 'פילפל משומר',
    'חצילים משומרים', 'לבבות דקלים', 'אנצ\'ובי',
    'פאסט עגבניות', 'רוטב פסטו', 'רוטב אלפרדו', 'רוטב בולונז',
    'מרק עוף', 'מרק ירקות', 'מרק בצל', 'מרק פטריות',
    'שעועית משומרת', 'חומוס גרגירים', 'טביט מוכן',
    'פלאפל מיקס', 'קובה מיקס', 'תבשיל מוכן', 'קארי מוכן',
    'רוטב צ\'ילי', 'רוטב ברביקיו', 'רוטב טריאקי', 'רוטב סויה'
  ],
  'תבלינים ורטבים': [
    'מלח', 'פלפל שחור', 'כמון', 'כורכום', 'פפריקה',
    'קינמון', 'הל', 'גרם מסאלה', 'רוטב סויה', 'רוטב דגים',
    'חרדל', 'מיונז', 'קטשופ', 'חומץ בלסמי', 'שמן שומשום',
    'זעתר', 'סומק', 'בהרט', 'קוריאנדר', 'ג\'ינג\'ר',
    'לוז קטן', 'פלפל אדום', 'צ\'ילי', 'חריף', 'פפריקה מעושנת',
    'אורגנו', 'בזיליקום', 'רוזמרין', 'טימין', 'מרווה',
    'דפי דפנה', 'זרעי חרדל', 'זרעי שומר', 'זרעי סלרי',
    'וניל', 'תמצית וניל', 'מים ורדים', 'מי פרחים',
    'שמן מנטה', 'חומץ יין', 'חומץ תפוחים', 'סירופ תמרים',
    'מלח ים', 'מלח היימלה', 'פלפל לבן', 'סכרין'
  ],
  'מוצרי בריאות': [
    'ויטמינים', 'מגנזיום', 'ויטמין D', 'אומגה 3', 'פרוביוטיקה',
    'חלבון אבקה', 'תוספי תזונה', 'תה ירוק', 'ג\'ינג\'ר',
    'כורכום כמוסות', 'ברזל', 'סידן',
    'ויטמין C', 'ויטמין B12', 'ויטמין B6', 'חומצה פולית',
    'ביוטין', 'ויטמין E', 'ויטמין A', 'מולטי ויטמין',
    'פרוביוטיקה לילדים', 'אנזימי עיכול', 'קולגן',
    'חלבון צמחי', 'קריאטין', 'BCAA', 'גלוטמין',
    'ספירולינה', 'כלורלה', 'רויבוש', 'קמומיל',
    'וולריאן', 'מליסה', 'אכינצאה', 'ג\'ינקו בילובה',
    'גרסיניה', 'ירוק קפה', 'משקה אלוורה', 'תוספי ברזל'
  ],
  'אלכוהול': [
    'יין אדום', 'יין לבן', 'בירה', 'וודקה', 'וויסקי',
    'ג\'ין', 'רום', 'קוניאק', 'שמפניה', 'ליקר',
    'אבסינת', 'טקילה',
    'בירה מקומית', 'בירה יבוא', 'בירה ללא אלכוהול',
    'יין מוסקט', 'יין רוזה', 'יין מתוק', 'יין יבש',
    'יין מקומי', 'יין יבוא', 'שמפניה מתוקה', 'פרוסקו',
    'אירי קרים', 'בייליס', 'קליוה', 'ליקר שקדים',
    'ליקר פירות', 'ברנדי', 'ארמניאק', 'קלווה',
    'סמבוקה', 'ג\'ינג\'ר ליקר', 'קשיו ליקר',
    'וויסקי סקוטש', 'וויסקי אירי', 'בורבון', 'טננסי'
  ],
  'מוצרי תינוקות': [
    'חלב תרכובת', 'מזון לתינוק', 'חיתולים', 'מגבונים לתינוק',
    'שמפו לתינוק', 'קרם החתלה', 'בקבוקי הזנה', 'מוצץ',
    'קרם לגירוי', 'סריג לתינוק',
    'חלב תרכובת שלב 1', 'חלב תרכובת שלב 2', 'חלב תרכובת שלב 3',
    'דגני תינוקות', 'פירה תינוקות', 'מזון אצבע לתינוקות',
    'תה לתינוקות', 'חליבה לחזה', 'משאבת חלב', 'אחסון חלב',
    'כף הזנה', 'צלחת לתינוק', 'כוס לתינוק', 'סינר לתינוק',
    'חיתולי שחייה', 'קרם שמש לתינוקות', 'משחק לשיניים',
    'מברשת שיניים לתינוק', 'ג\'ל שיניים', 'משכך כאבים לתינוק'
  ],
  'מוצרי חיות מחמד': [
    'מזון לכלב', 'מזון לחתול', 'חול לחתולים', 'קולר',
    'צעצועים לכלב', 'רצועה', 'קערת מזון', 'קערת מים',
    'עצמות ללעיסה', 'שמפו לכלב',
    'מזון יבש לכלב', 'מזון רטוב לכלב', 'חטיפים לכלב',
    'מזון יבש לחתול', 'מזון רטוב לחתול', 'חטיפים לחתול',
    'חול סיליקה', 'חול טבעי', 'חול מתגבש', 'חול מבושם',
    'כדור צמר לחתול', 'מתקן גירוד', 'צעצוע נוצות',
    'רצועה נמתחת', 'רתמה לכלב', 'מחסום לכלב', 'מזרן לכלב',
    'בית לכלב', 'מנשא לחתול', 'תיק נשיאה', 'גלגל לאוגר',
    'מזון לדגים', 'מזון לציפורים', 'זרעים לציפורים'
  ],
  'אחר': [
    'נרות', 'סוללות', 'פרחים', 'מתנות', 'עיתונים',
    'דבק', 'נייר אלומיניום', 'ניילון נצמד',
    'נרות שבת', 'נרות רגילים', 'נרות ארומה', 'נרות טאי ליט',
    'סוללות AA', 'סוללות AAA', 'סוללות 9V', 'סוללות שעון',
    'מפת שולחן', 'כלי חד פעמי', 'צלחות נייר', 'כוסות נייר',
    'דבק קרפט', 'דבק חזק', 'סקוטש', 'דבק אינסטנט',
    'עטים', 'עפרונות', 'מחדד', 'מחק', 'מחברות',
    'תיקיות', 'נייר A4', 'מדבקות', 'מכונת הדבקה',
    'כרטיסי ברכה', 'נייר עטיפה', 'סרטים', 'קשתות'
  ]
}
