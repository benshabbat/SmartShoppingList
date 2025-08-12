/**
 * LoginForm Constants
 * Centralized constants for better maintainability and DRY principles
 */

export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_FULLNAME_LENGTH: 2,
} as const

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
    ],
  },
  ACCOUNT_BENEFITS: {
    TITLE: '🌟 יתרונות החשבון:',
    DESCRIPTION: 'סנכרון בין מכשירים • גיבוי ענן • שיתוף רשימות • סטטיסטיקות מתקדמות',
  },
  FORM: {
    LABELS: {
      FULL_NAME: 'שם מלא',
      EMAIL: 'מייל',
      PASSWORD: 'סיסמה',
    },
    BUTTONS: {
      LOGIN: '🔑 התחבר עם חשבון',
      SIGNUP: '✨ הירשם עם חשבון',
      LOADING: '⏳ מתבצע...',
      FORGOT_PASSWORD: 'שכחת סיסמה?',
    },
    TOGGLE: {
      TO_SIGNUP: 'אין לך חשבון? הירשם כאן',
      TO_LOGIN: 'יש לך חשבון? התחבר כאן',
    },
  },
  SEPARATOR: 'או התחבר עם חשבון',
} as const

export const CSS_CLASSES = {
  GRADIENT: {
    BACKGROUND: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100',
    BRAND: 'bg-gradient-to-r from-blue-600 to-purple-600',
    BRAND_TEXT: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
    GUEST_SECTION: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    PRIMARY_BUTTON: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    SECONDARY_BUTTON: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300',
  },
  CARD: {
    MAIN: 'bg-white/80 backdrop-blur-sm shadow-xl border-0',
    GUEST_SECTION: 'p-4 rounded-xl border border-blue-200',
    BENEFITS_SECTION: 'p-3 bg-green-50 rounded-lg border border-green-200',
  },
  BUTTON: {
    PRIMARY: 'w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2',
    SECONDARY: 'w-full text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
    LINK: 'text-blue-600 hover:text-blue-800 text-sm',
  },
  INPUT: {
    FIELD: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    LABEL: 'block text-sm font-medium text-gray-700 mb-1',
  },
  ALERT: {
    ERROR: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg',
    SUCCESS: 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg',
  },
} as const

export const LAYOUT = {
  CONTAINER: 'min-h-screen flex items-center justify-center p-4',
  FORM_WRAPPER: 'w-full max-w-md',
  LOGO_SIZE: 'w-20 h-20',
  SPACING: {
    SECTION: 'mb-6',
    FORM: 'space-y-4',
    TEXT_CENTER: 'text-center',
  },
} as const
