/**
 * LoginForm Constants
 * All constants for the LoginForm component organized in one place
 */

// Re-export needed constants from main constants file
export { FORM_VALIDATION } from '../../constants'

// UI Text constants specific to LoginForm
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
  FORM: {
    LABELS: {
      FULL_NAME: 'שם מלא',
      EMAIL: 'כתובת מייל',
      PASSWORD: 'סיסמה',
    },
    BUTTONS: {
      LOGIN: 'התחבר',
      SIGNUP: 'הירשם',
      LOADING: 'טוען...',
    },
  },
} as const

// CSS Classes for styling
export const CSS_CLASSES = {
  GRADIENT: {
    BACKGROUND: 'bg-gradient-to-br from-indigo-50 via-white to-blue-50',
    SECONDARY_BUTTON: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    BRAND: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  },
  CARD: {
    MAIN: 'max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl border border-white/20',
  },
  BUTTON: {
    SECONDARY: 'text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200',
  },
} as const

// Layout constants
export const LAYOUT = {
  CONTAINER: 'min-h-screen flex items-center justify-center p-4',
  FORM_WRAPPER: 'w-full max-w-md',
  LOGO_SIZE: 'w-16 h-16',
  SPACING: {
    FORM: 'space-y-6',
    TEXT_CENTER: 'text-center',
    SECTION: 'mb-8',
  },
} as const
