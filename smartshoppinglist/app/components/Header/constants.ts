/**
 * Header Constants
 * Centralized constants for better maintainability and DRY principles
 */

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
      'אבל הם גם לא יסונכרנו אוטומטית לחשבון החדש.\n\n' +
      'אם יש לך נתונים חשובים, וודא שאתה זוכר אותם או תעשה צילום מסך לפני המעבר.\n\n' +
      'האם אתה בטוח שברצונך להמשיך להתחברות?'
  },
} as const

export const HEADER_STYLES = {
  CONTAINER: 'text-center mb-8 relative',
  LEFT_ACTIONS: 'absolute top-0 left-0 flex gap-2',
  RIGHT_ACTIONS: 'absolute top-0 right-0 flex gap-2',
  BRAND_SECTION: 'flex items-center justify-center gap-3 mb-3',
  DESCRIPTION: 'text-sm text-gray-500 mb-2',
  
  BUTTON: {
    BASE: 'p-2 rounded-full transition-colors group',
    HELP: 'hover:bg-purple-100',
    SOUND: 'hover:bg-purple-100',
    RECEIPT: 'hover:bg-green-100',
    STATISTICS: 'hover:bg-blue-100',
    HOME: 'hover:bg-green-100',
    LOGOUT: 'p-1 hover:bg-red-100 rounded-full transition-colors',
  },
  
  ICON: {
    STANDARD: 'w-6 h-6',
    SMALL: 'w-4 h-4',
    LARGE: 'w-8 h-8',
    HELP: 'text-purple-600 group-hover:text-purple-700',
    SOUND_ON: 'text-purple-600 group-hover:text-purple-700',
    SOUND_OFF: 'text-gray-400 group-hover:text-gray-600',
    RECEIPT: 'text-green-600 group-hover:text-green-700',
    STATISTICS: 'text-blue-600 group-hover:text-blue-700',
    HOME: 'text-green-600 group-hover:text-green-700',
    LOGOUT: 'text-red-600',
    USER: 'text-gray-600',
    BRAND: 'text-white',
  },
  
  BRAND: {
    LOGO_CONTAINER: 'bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 shadow-lg',
    TITLE: 'text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
    SUBTITLE: 'text-gray-600 text-sm',
  },
  
  USER_MENU: {
    CONTAINER: 'flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border',
    EMAIL: 'text-sm text-gray-700',
    LOGIN_BUTTON: 'text-xs text-blue-600 hover:text-blue-800 underline',
  },
} as const

export const ROUTES = {
  HOME: '/',
  STATISTICS: '/statistics',
} as const
