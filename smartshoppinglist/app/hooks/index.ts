/**
 * Custom Hooks Exports
 * Central export file for all custom hooks following clean code principles
 */

// Form and UI hooks
export { useFormField, useFormState } from './useFormState'
export { useKeyboardNavigation } from './useKeyboardNavigation'
export { useAutoCompleteLogic } from './useAutoCompleteLogic'
export { useCategorySelectorLogic } from './useCategorySelectorLogic'
export { useSmartSuggestionsLogic } from './useSmartSuggestionsLogic'

// Authentication hooks
export { 
  useAuth, 
  useSession, 
  useCurrentUser, 
  useLogin, 
  useSignUp, 
  useLogout, 
  useGuestMode 
} from './useAuth'
export { useAuthContext } from './useAuthContext'

// Analytics and statistics
export { 
  useAnalytics, 
  useSmartSuggestions, 
  usePopularItems, 
  useCategoryAnalytics 
} from './useAnalytics'
export { useStatistics } from './useStatistics'

// Store exports
export * from '../stores'
