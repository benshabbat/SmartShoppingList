/**
 * Central Constants File
 * All constants organized in one place for better maintainability
 */

import { Category } from './types'

// === ENVIRONMENT CONSTANTS ===
export const ENV_CONSTANTS = {
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const

// === TIME CONSTANTS ===
export const TIME_CONSTANTS = {
  NOTIFICATION_TIMEOUT: 3000,
  ANIMATION_DELAY_BASE: 100,
  EXPIRY_WARNING_DAYS: 3,
  WEEK_IN_DAYS: 7,
  TWO_WEEKS_IN_DAYS: 14,
} as const

// === UI CONSTANTS ===
export const UI_CONSTANTS = {
  MIN_PRODUCT_NAME_LENGTH: 2,
  MAX_PRODUCT_NAME_LENGTH: 50,
  MAX_TUTORIAL_STEPS: 6,
  DEFAULT_PAGE_SIZE: 10,
} as const

// === FORM VALIDATION CONSTANTS ===
export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_FULLNAME_LENGTH: 2,
} as const

// === STORAGE KEYS ===
export const STORAGE_KEYS = {
  SHOPPING_LIST: 'shoppingList',
  SHOPPING_DATA: 'shoppingData',
  PURCHASE_HISTORY: 'purchaseHistory',
  PANTRY_ITEMS: 'pantryItems',
  LAST_VISIT: 'lastVisit'
} as const

// === ROUTES CONSTANTS ===
export const ROUTES = {
  HOME: '/',
  STATISTICS: '/statistics',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

// === CSS CONSTANTS ===
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

// === COLOR SCHEMES ===
export const COLOR_SCHEMES = {
  PRIMARY: 'from-indigo-500 to-purple-600',
  SUCCESS: 'from-green-500 to-emerald-600',
  WARNING: 'from-amber-500 to-orange-600',
  DANGER: 'from-red-500 to-pink-600',
  INFO: 'from-blue-500 to-indigo-600',
} as const

// === CATEGORIES ===
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

// === MESSAGES ===
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

// === HEADER CONSTANTS ===
export const HEADER_TEXT = {
  BRAND: {
    TITLE: 'רשימת קניות חכמה',
    SUBTITLE: 'נהל את הקניות שלך בקלות ויעילות',
    DESCRIPTION: 'ניהול קניות חכם ויעיל עם טכנולוגיה מתקדמת',
  },
  TOOLTIPS: {
    HELP: 'עזרה וטיפים',
    SOUND_ON: 'השתק צלילים',
    SOUND_OFF: 'הפעל צלילים',
    RECEIPT_SCANNER: 'סרוק קבלה',
    STATISTICS: 'סטטיסטיקות מתקדמות',
    HOME: 'חזרה לדף הבית',
    LOGOUT_GUEST: 'צא ממצב אורח',
    LOGOUT_USER: 'התנתק',
    LOGIN: 'התחבר עם חשבון',
  },
  USER: {
    GUEST: 'אורח',
    LOGIN_CTA: 'התחבר',
  },
  CONFIRM_MESSAGES: {
    GUEST_TO_AUTH: 
      '⚠️ הודעה חשובה!\n\n' +
      'כאשר תעבור למצב התחברות עם חשבון, הנתונים הנוכחיים שנשמרו במכשיר זה לא יימחקו, ' +
      'אך לא יועברו אוטומטית לחשבון החדש שלך.\n\n' +
      '💡 המלצה: אם יש לך רשימת קניות חשובה, תוכל לייצא אותה דרך האפשרויות המתקדמות לפני המעבר.\n\n' +
      'האם ברצונך להמשיך?',
    LOGOUT_GUEST: 
      'האם אתה בטוח שברצונך לצאת ממצב אורח?\n\n' +
      'הנתונים שלך יישארו שמורים במכשיר זה ותוכל לחזור אליהם בכל עת.',
    LOGOUT_USER: 
      'האם אתה בטוח שברצונך להתנתק?\n\n' +
      'תוכל להתחבר שוב בכל עת עם פרטי החשבון שלך.',
  },
} as const

// === LOGIN FORM CONSTANTS ===
export const UI_TEXT = {
  BRAND: {
    TITLE: 'רשימת קניות חכמה',
    SUBTITLE: 'נהל את הקניות שלך בקלות ויעילות',
    EMOJI: '🛒',
  },
  AUTH: {
    LOGIN_TITLE: '🔐 התחברות',
    LOGIN_SUBTITLE: 'ברוכים השבים לרשימת הקניות החכמה!',
    SIGNUP_TITLE: '📝 הרשמה',
    SIGNUP_SUBTITLE: 'הצטרפו למשפחת הקונים החכמים',
  },
  GUEST_MODE: {
    TITLE: 'מצב אורח - התחל מיד!',
    DESCRIPTION: 'התחל לנהל את רשימת הקניות שלך מיד ללא רישום. הנתונים יישמרו במכשיר זה באופן מקומי.',
    CTA: 'התחל כאורח - ללא רישום!',
    BENEFITS: [
      'התחלה מיידית ללא רישום',
      'שמירה מקומית במכשיר',
      'אפשרות להירשם מאוחר יותר',
      'פרטיות מלאה',
    ],
  },
} as const

// === MAIN VIEW CONSTANTS ===
export const MAIN_VIEW_TEXT = {
  GUEST_EXPLANATION: {
    TITLE: '🎉 ברוך הבא למצב אורח!',
    DESCRIPTION: 'אתה כעת במצב אורח - כל הנתונים שלך נשמרים באופן מקומי במכשיר זה ולא נשלחים לשום שרת. זה אומר פרטיות מלאה, אבל גם שהנתונים זמינים רק במכשיר הזה.',
    BUTTON_TEXT: 'הבנתי',
    ICON: 'ℹ️',
  },
} as const

export const MAIN_VIEW_STYLES = {
  CONTAINER: 'container mx-auto px-4 py-6 max-w-4xl space-y-6',
  CARD: 'bg-white rounded-xl shadow-lg p-6',
  GUEST_EXPLANATION: {
    CONTAINER: 'bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6 border border-indigo-200',
    CONTENT: 'flex items-start gap-3',
    ICON_CONTAINER: 'bg-indigo-100 rounded-full p-2 mt-1',
    TEXT_CONTAINER: 'flex-1',
    TITLE: 'font-bold text-indigo-900 mb-2',
    DESCRIPTION: 'text-sm text-indigo-700 mb-3 leading-relaxed',
    BUTTON_CONTAINER: 'flex gap-2',
    BUTTON: 'text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors',
  },
} as const

// === COMMON PRODUCTS ===
export const COMMON_PRODUCTS: Record<Category, string[]> = {
  'פירות וירקות': [
    'תפוחים', 'בננות', 'תפוזים', 'עגבניות', 'מלפפונים',
    'גזר', 'בצל', 'שום', 'פלפל', 'חסה', 'תרד', 'בטטה',
    'תפוחי אדמה', 'ברוקולי', 'כרובית', 'קישואים', 'לימונים',
    'אבוקדו', 'ענבים', 'אפרסקים', 'אגס', 'דובדבנים',
    'תות שדה', 'פטרוזיליה', 'כוסברה', 'נענע', 'בזיליקום'
  ],
  'מוצרי חלב': [
    'חלב', 'גבינה צהובה', 'גבינה לבנה', 'יוגורט', 'חמאה',
    'שמנת', 'גבינת קוטג\'', 'גבינת מוצרלה', 'גבינת פטה',
    'ביצים', 'חלב שקדים', 'חלב קוקוס', 'גבינה קשה',
    'גבינת שמנת', 'יוגורט יווני', 'חלב סויה', 'חלב שיבולת שועל'
  ],
  'בשר ודגים': [
    'עוף שלם', 'חזה עוף', 'כרעי עוף', 'בשר בקר טחון',
    'אנטריקוט', 'סטייק', 'כבש', 'נקניקיות', 'נתחי דג',
    'סלמון', 'טונה', 'דג לבן', 'בקלה', 'סרדינים'
  ],
  'לחם ומאפים': [
    'לחם לבן', 'לחם מלא', 'חלה', 'פיתה', 'לחמניות',
    'בגט', 'קרקרים', 'מצות', 'לחם דל גלוטן',
    'עוגיות', 'קרואסון', 'מאפה גבינה', 'בורקס'
  ],
  'משקאות': [
    'מים', 'מיץ תפוזים', 'קולה', 'בירה', 'יין',
    'קפה', 'תה', 'מיץ ענבים', 'מיץ תפוחים', 'סודה',
    'מים מוגזים', 'אנרגיה', 'מיץ גזר', 'לימונדה'
  ],
  'חטיפים ומתוקים': [
    'שוקולד', 'ביסקוויטים', 'חטיפי דגנים', 'אגוזים',
    'בוטנים', 'צימוקים', 'גומי דובים', 'ממתקים',
    'שוקולד חלב', 'שוקולד מריר', 'וופל', 'חטיף אנרגיה'
  ],
  'מוצרי ניקיון': [
    'סבון כלים', 'נוזל רצפות', 'אבקת כביסה', 'מרכך כביסה',
    'אקונומיקה', 'נייר טואלט', 'מגבונים', 'ניקוי זכוכית',
    'שקיות זבל', 'מטליות ניקוי', 'ספוגים'
  ],
  'מוצרי היגיינה': [
    'משחת שיניים', 'מברשת שיניים', 'שמפו', 'מרכך שיער',
    'סבון רחצה', 'דאודורנט', 'קרם גוף', 'תחבושות',
    'מגני הגלחה', 'קרם גילוח', 'מסכת פנים'
  ],
  'מזון יבש': [
    'אורז', 'פסטה', 'עדשים', 'חומוס', 'שעועית',
    'קמח', 'סוכר', 'מלח', 'שמן זית', 'שמן חמניות',
    'קינואה', 'בורגול', 'כוסמת', 'קוקוס מגורד'
  ],
  'קפואים': [
    'ירקות קפואים', 'דגים קפואים', 'גלידה', 'פיצה קפואה',
    'עוף קפוא', 'פירות קפואים', 'שניצל קפוא',
    'חטיפים קפואים', 'ברוקולי קפוא', 'אפונה קפואה'
  ],
  'שימורים ומוכנים': [
    'טונה משומרת', 'תירס משומר', 'עגבניות משומרות', 'פתרון מוכן',
    'מרק שקיות', 'רוטב עגבניות', 'חומוס מוכן', 'טחינה',
    'זיתים', 'מלפפונים חמוצים', 'סרדינים משומרים'
  ],
  'תבלינים ורטבים': [
    'מלח', 'פלפל שחור', 'כמון', 'כורכום', 'פפריקה',
    'קינמון', 'הל', 'גרם מסאלה', 'רוטב סויה', 'רוטב דגים',
    'חרדל', 'מיונז', 'קטשופ', 'חומץ בלסמי'
  ],
  'מוצרי בריאות': [
    'ויטמינים', 'מגנזיום', 'ויטמין D', 'אומגה 3', 'פרוביוטיקה',
    'חלבון אבקה', 'תוספי תזונה', 'תה ירוק', 'ג\'ינג\'ר',
    'כורכום כמוסות', 'ברזל', 'סידן'
  ],
  'אלכוהול': [
    'יין אדום', 'יין לבן', 'בירה', 'וודקה', 'וויסקי',
    'ג\'ין', 'רום', 'קוניאק', 'שמפניה', 'ליקר'
  ],
  'מוצרי תינוקות': [
    'חלב תרכובת', 'מזון לתינוק', 'חיתולים', 'מגבונים לתינוק',
    'שמפו לתינוק', 'קרם החתלה', 'בקבוקי הזנה', 'מוצץ'
  ],
  'מוצרי חיות מחמד': [
    'מזון לכלב', 'מזון לחתול', 'חול לחתולים', 'קולר',
    'צעצועים לכלב', 'רצועה', 'קערת מזון', 'קערת מים'
  ],
  'אחר': [
    'נרות', 'סוללות', 'פרחים', 'מתנות', 'עיתונים',
    'דבק', 'נייר אלומיניום', 'ניילון נצמד', 'כלי חד פעמי'
  ]
}
