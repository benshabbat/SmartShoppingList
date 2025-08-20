/**
 * Header Component Constants
 * Contains all styles and re-exports needed constants from main constants file
 */

// Re-export needed constants from main constants file
export { HEADER_TEXT, ROUTES } from '../../../constants'

// Header-specific styles
export const HEADER_STYLES = {
  // Main container
  CONTAINER: 'flex items-center justify-between p-4 bg-white shadow-sm border-b',
  
  // Brand Section Styles
  BRAND_SECTION: 'flex items-center gap-4 mb-4',
  BRAND: {
    LOGO_CONTAINER: 'flex-shrink-0',
    TITLE: 'text-2xl font-bold text-gray-800 text-right',
    SUBTITLE: 'text-sm text-gray-600 text-right',
  },
  
  // Description styles
  DESCRIPTION: 'text-center text-gray-600 mb-6',
  
  // Button styles
  BUTTON: {
    BASE: 'flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:scale-105',
    STATISTICS: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
    HOME: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    HELP: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    SOUND: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    RECEIPT: 'bg-green-100 hover:bg-green-200 text-green-700',
    LOGOUT: 'flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors',
  },
  
  // Icon styles
  ICON: {
    SMALL: 'w-4 h-4',
    STANDARD: 'w-5 h-5',
    LARGE: 'w-6 h-6',
    BRAND: 'text-indigo-600',
    USER: 'text-gray-600',
    STATISTICS: 'text-indigo-600',
    HOME: 'text-blue-600',
    HELP: 'text-gray-600',
    SOUND_ON: 'text-green-600',
    SOUND_OFF: 'text-gray-400',
    RECEIPT: 'text-green-600',
    LOGOUT: 'text-red-500',
  },
  
  // Layout styles
  LEFT_ACTIONS: 'flex items-center gap-2',
  
  // User Menu styles
  USER_MENU: {
    CONTAINER: 'flex items-center gap-3',
    EMAIL: 'text-sm text-gray-600 hidden sm:block',
    LOGIN_BUTTON: 'text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors',
  },
} as const
