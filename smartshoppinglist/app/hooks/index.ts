/**
 * Custom Hooks Exports
 * Central export file for all custom hooks following clean code principles
 */

// Form and UI hooks
export { useFormField, useFormState } from './useFormState'
export { useKeyboardNavigation } from './useKeyboardNavigation'

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

// Shopping and data hooks
export { useShoppingList } from './useShoppingList'
export { 
  useShoppingItems, 
  useShoppingItem, 
  useAddShoppingItem, 
  useUpdateShoppingItem, 
  useDeleteShoppingItem,
  shoppingItemKeys 
} from './useShoppingItems'

// Analytics and statistics
export { 
  useAnalytics, 
  useSmartSuggestions, 
  usePopularItems, 
  useCategoryAnalytics 
} from './useAnalytics'
export { useStatistics } from './useStatistics'

// Application data hooks
export { useConstants } from './useConstants'

// Store exports
export * from '../stores'
