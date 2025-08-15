/**
 * Hook Types - Custom React Hooks and State Management
 * Contains all types related to custom hooks, their parameters, and return values
 */

import { ShoppingItem, ItemSuggestion, ExpiringItem } from './data'
import { StoreUser, AnalyticsState, CategoryStats } from './stores'

// === AUTH HOOK TYPES ===

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  options?: {
    data?: {
      full_name?: string
    }
  }
}

export interface UseAuthOptions {
  redirectOnLogin?: string
  redirectOnLogout?: string
  autoRefresh?: boolean
}

export interface UseAuthReturn {
  user: StoreUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isGuest: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: SignUpCredentials) => Promise<void>
  logout: () => Promise<void>
  signInAsGuest: () => void
  switchToAuth: () => void
  error: string | null
}

// === FORM HOOK TYPES ===

export interface UseFormFieldOptions<T> {
  initialValue: T
  validator?: (value: T) => string | undefined
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export interface FormField<T> {
  value: T
  error?: string
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
}

export interface UseFormFieldReturn<T> extends FormField<T> {
  setValue: (value: T) => void
  setError: (error?: string) => void
  validate: () => boolean
  reset: () => void
  handleChange: (value: T) => void
  handleBlur: () => void
}

export interface UseFormStateOptions<T> {
  initialValues: T
  validationSchema?: any // Could be Yup, Zod, or custom validation
  onSubmit?: (values: T) => void | Promise<void>
}

export interface UseFormStateReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  setValue: (field: keyof T, value: T[keyof T]) => void
  setError: (field: keyof T, error?: string) => void
  setValues: (values: Partial<T>) => void
  validate: () => boolean
  reset: () => void
  handleSubmit: (e?: Event) => Promise<void>
}

// === KEYBOARD NAVIGATION HOOK TYPES ===

export interface UseKeyboardNavigationOptions {
  itemCount: number
  isOpen: boolean
  onSelect: (index: number) => void
  onClose: () => void
  loop?: boolean
  disabled?: boolean
}

export interface UseKeyboardNavigationReturn {
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  handleKeyDown: (event: KeyboardEvent) => void
  focusNext: () => void
  focusPrevious: () => void
  selectCurrent: () => void
  reset: () => void
}

// === ANALYTICS HOOK TYPES ===

export interface UseAnalyticsOptions {
  refreshInterval?: number
  dateRange?: {
    from: Date
    to: Date
  }
  categories?: string[]
}

export interface UseAnalyticsReturn {
  data: AnalyticsState
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  calculateStats: () => void
  getCategoryInsights: (category: string) => CategoryStats | null
  getItemHistory: (itemName: string) => ShoppingItem[]
  exportData: () => string
}

// === STATISTICS HOOK TYPES ===

export interface UseStatisticsOptions {
  period?: 'week' | 'month' | 'year'
  includeDeleted?: boolean
  realTime?: boolean
}

export interface StatisticsData {
  totalItems: number
  completionRate: number
  averageItemsPerWeek: number
  topCategories: Array<{ name: string; count: number }>
  recentTrends: Array<{ date: string; count: number }>
  spendingAnalysis: {
    total: number
    average: number
    trend: 'up' | 'down' | 'stable'
  }
}

export interface UseStatisticsReturn {
  data: StatisticsData
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  getDetailedStats: (category?: string) => CategoryStats | null
}

// === GENERIC HOOK TYPES ===

export interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  deps?: any[]
}

export interface UseAsyncReturn<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

export interface UseLocalStorageOptions<T = unknown> {
  serializer?: {
    read: (value: string) => T
    write: (value: T) => string
  }
  defaultValue?: T
}

export interface UseLocalStorageReturn<T> {
  value: T
  setValue: (value: T | ((prev: T) => T)) => void
  removeValue: () => void
}

export interface UseDebounceOptions {
  delay: number
  immediate?: boolean
}

export interface UseThrottleOptions {
  delay: number
  leading?: boolean
  trailing?: boolean
}

// === SHOPPING HOOK TYPES ===

export interface UseShoppingDataOptions {
  autoSync?: boolean
  cacheTimeout?: number
  optimisticUpdates?: boolean
}

export interface UseShoppingDataReturn {
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  loading: boolean
  error: string | null
  addItem: (name: string, category: string) => Promise<void>
  updateItem: (id: string, updates: Partial<ShoppingItem>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

// === VALIDATION HOOK TYPES ===

export interface ValidationRule<T = unknown> {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: T) => string | undefined
}

export interface UseValidationOptions<T> {
  rules: Record<keyof T, ValidationRule>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export interface UseValidationReturn<T> {
  validate: (values: T) => Record<keyof T, string>
  validateField: (field: keyof T, value: any) => string | undefined
  isValid: (values: T) => boolean
}

// === CONTEXT HOOK TYPES ===

export interface UseAuthContextOptions {
  required?: boolean
  redirectTo?: string
}

export interface UseAuthContextReturn {
  user: StoreUser | null
  session: any | null
  loading: boolean
  isGuest: boolean
  signOut: () => Promise<void>
  signInAsGuest: () => void
  switchToAuth: () => void
  isAuthenticated: boolean
}
