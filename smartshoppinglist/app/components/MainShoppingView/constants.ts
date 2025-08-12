/**
 * MainShoppingView Constants
 * Centralized constants for better maintainability
 */

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
