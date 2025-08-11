/**
 * Application constants following DRY principles
 */

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

// Status messages
export const MESSAGES = {
  SUCCESS: {
    ITEM_ADDED: 'מוצר נוסף לרשימה',
    ITEM_ADDED_TO_CART: 'נוסף לסל',
    PURCHASE_COMPLETED: 'קנייה הושלמה!',
    LIST_CREATED: 'רשימה נוצרה!',
    CLEARED: 'נוקה',
  },
  ERROR: {
    ITEM_REMOVED: 'מוצר הוסר',
    EMPTY_CART: 'הסל ריק',
    NO_ITEMS_TO_PURCHASE: 'אין מוצרים בסל לקנייה',
    INVALID_NAME: 'שם המוצר לא תקין',
    NAME_TOO_SHORT: 'שם המוצר קצר מדי',
    NAME_TOO_LONG: 'שם המוצר ארוך מדי',
    PRODUCT_EXISTS: 'המוצר כבר קיים ברשימה',
  },
  INFO: {
    REMOVED_FROM_CART: 'הוסר מהסל',
    CART_CLEARED: 'הסל נוקה',
    ALL_PURCHASED_CLEARED: 'כל הרכישות הושלמו נמחקו',
  },
} as const

// Chart colors for statistics
export const CHART_COLORS = [
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-red-400 to-red-600',
  'from-gray-400 to-gray-600',
] as const

// Animation constants
export const ANIMATION_CONSTANTS = {
  FADE_IN_DURATION: 'duration-300',
  SLIDE_UP_DURATION: 'duration-500',
  HOVER_SCALE: 'hover:scale-105',
  TRANSITION_ALL: 'transition-all',
} as const
