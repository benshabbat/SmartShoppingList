// Custom hooks following clean code principles
export { useFormField, useFormState } from './useFormState'
export { useKeyboardNavigation } from './useKeyboardNavigation'
export { useItemOperations } from './useItemOperations'
export { useStatistics } from './useStatistics'
export { useAuth } from './useAuth'
export { useAuthContext } from './useAuthContext'
export { useConstants } from './useConstants'

// Re-export existing hooks
export { useShoppingList } from './useShoppingList'

// Export new TanStack Query hooks
export * from './useAuthQueries'
export * from './useShoppingItems'

// Export stores
export * from '../stores'
