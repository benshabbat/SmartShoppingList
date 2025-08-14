/**
 * Central Type Definitions for Smart Shopping List Application
 * 
 * This file contains all TypeScript type definitions organized by category:
 * - Base types: Common UI types and component patterns
 * - UI Components: Props and interfaces for React components
 * - Core Data: Shopping items, suggestions, receipts, and categories
 * - Validation & Error: Error handling and form validation
 * - Navigation & Interaction: Keyboard navigation and user interactions
 * - UI Style & Theme: Style variants and theming configuration
 * - User & Authentication: User data and auth context
 * - Shopping Context & State: Complex state management for shopping functionality
 * 
 * Design Principles Applied:
 * - DRY: Common patterns extracted to base types
 * - Composition: Complex interfaces built from smaller, focused interfaces
 * - Consistency: Unified naming conventions and type patterns
 * - Extensibility: Base types allow for easy extension and modification
 */

import { User as SupabaseUser, Session } from '@supabase/supabase-js'

// === BASE TYPES ===

// Common UI types
export type AlertType = 'success' | 'error' | 'info' | 'warning'
export type ComponentSize = 'sm' | 'md' | 'lg'
export type Position = 'top' | 'bottom' | 'left' | 'right'
export type ComponentVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
export type ItemStatus = 'pending' | 'inCart' | 'purchased'

// Base component props
export interface BaseComponentProps {
  className?: string
  disabled?: boolean
}

export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
}

// === UI COMPONENTS TYPES ===

// Tutorial types
export interface TutorialStep {
  title: string
  description: string
  target?: string
  position?: Position
}

// Toast types
export interface Toast {
  id: string
  type: AlertType
  title: string
  message?: string
  duration?: number
}

export interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

export interface SimpleToastProps {
  message: string
  type: AlertType
}

// Notification Banner types
export interface NotificationBannerProps extends BaseComponentProps {
  type: 'auto-change' | 'suggestion'
  message: string
  category?: Category
  productName?: string
  onAccept?: () => void
  onDismiss?: () => void
  isVisible: boolean
}

// Item Actions types
export type ItemActionType = 'add-to-cart' | 'remove-from-cart' | 'mark-purchased' | 'remove'

export interface ItemActionsProps extends BaseComponentProps {
  variant: ItemStatus
  onToggleCart: () => void
  onRemove: () => void
}

// Shopping Item Component types
export interface ShoppingItemBaseProps {
  item: ShoppingItem
  variant?: ItemStatus
}

export interface ShoppingItemComponentProps extends ShoppingItemBaseProps {}
export interface ShoppingItemUIProps extends ShoppingItemBaseProps {}
export interface UseShoppingItemLogicProps extends ShoppingItemBaseProps {}

// Suggestion Item types
export interface SuggestionItemProps {
  suggestion: string
  isHighlighted: boolean
  onClick: () => void
}

// Loading Overlay types
export interface LoadingOverlayProps {
  message?: string
}

// Interactive Emoji types
export interface InteractiveEmojiProps {
  category: string
  size?: ComponentSize
  interactive?: boolean
}

// Category Selector types
export interface CategorySelectorProps extends BaseComponentProps {
  value: Category
  onChange: (category: Category) => void
  categories: Category[]
  isHighlighted?: boolean
}

// === FORM TYPES ===

// Base form field props
export interface BaseFormFieldProps extends BaseComponentProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
}

export interface FormFieldProps extends BaseFormFieldProps {
  label: string
  type: 'email' | 'password' | 'text'
  minLength?: number
}

export interface AlertProps extends BaseComponentProps {
  type: AlertType
  message: string
}

export interface SeparatorProps extends BaseComponentProps {
  text?: string
}

export interface GuestModeSectionProps extends BaseComponentProps {
  onGuestLogin: () => void
}

export interface AccountBenefitsSectionProps extends BaseComponentProps {}

// Auth Header types
export interface AuthHeaderProps extends BaseComponentProps {
  isLogin: boolean
}

export interface BrandHeaderProps extends BaseComponentProps {}

// ExpiryDateModal types
export interface ExpiryDateModalUIProps extends BaseModalProps {
  items: ShoppingItem[]
  
  // State
  expiryDates: Record<string, string>
  skippedItems: Set<string>
  
  // Computed values
  today: string
  quickDateOptions: Array<{ label: string; days: number }>
  hasAnyDates: boolean
  allItemsProcessed: boolean
  
  // Event handlers
  onExpiryDateChange: (itemId: string, date: string) => void
  onSkipItem: (itemId: string) => void
  onSubmit: () => void
  onSkip: () => void
  onQuickDateSet: (itemId: string, days: number) => void
  onSetAllDates: (days: number) => void
}

export interface UseExpiryDateModalLogicProps {
  items: ShoppingItem[]
  onSubmit: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  onClose: () => void
}

// ActionButton types
export interface ActionButtonProps extends BaseComponentProps {
  onClick: () => void
  icon: any // LucideIcon
  children: React.ReactNode
  variant?: ComponentVariant
  size?: ComponentSize
  loading?: boolean
  iconSize?: number
}

// === CORE DATA TYPES ===

export interface ShoppingItem {
  id: string
  name: string
  category: string
  isInCart: boolean
  isPurchased: boolean
  addedAt: Date
  purchasedAt?: Date
  expiryDate?: Date
  purchaseLocation?: string
  price?: number
}

export interface ItemSuggestion {
  id: string
  name: string
  frequency: number
  lastBought?: Date
  daysSinceLastBought: number
  category?: string
  confidence?: number
}

export interface ExpiringItem {
  id: string
  name: string
  expiryDate: Date
  daysUntilExpiry: number
}

export interface ReceiptItem {
  name: string
  price: number
  quantity?: number
  category?: string
}

export interface ReceiptData {
  items: ReceiptItem[]
  storeName: string
  totalAmount: number
  date: Date
}

// === CATEGORY TYPES ===

// Main category type - used throughout the app
export type Category = 
  | 'פירות וירקות'
  | 'מוצרי חלב'
  | 'בשר ודגים'
  | 'לחם ומאפים'
  | 'משקאות'
  | 'חטיפים ומתוקים'
  | 'מוצרי ניקיון'
  | 'מוצרי היגיינה'
  | 'מזון יבש'
  | 'קפואים'
  | 'שימורים ומוכנים'
  | 'תבלינים ורטבים'
  | 'מוצרי בריאות'
  | 'אלכוהול'
  | 'מוצרי תינוקות'
  | 'מוצרי חיות מחמד'
  | 'אחר'

// Legacy category type - kept for backward compatibility with utils/categories.ts
// TODO: Migrate to use Category type and remove this
export type CategoryType = 
  | 'מוצרי חלב'
  | 'בשר ודגים'
  | 'ירקות'
  | 'פירות'
  | 'לחם ומאפים'
  | 'דגנים'
  | 'מתוקים'
  | 'משקאות'
  | 'חטיפים'
  | 'מוכן'
  | 'קפואים'
  | 'שמנים ותבלינים'
  | 'כללי'

// === VALIDATION & ERROR TYPES ===

export interface ValidationResult {
  isValid: boolean
  error?: string
  errors?: string[]
}

export type Validator<T> = (value: T) => ValidationResult
export type ErrorType = 'validation' | 'business' | 'system'

export interface AppError {
  type: ErrorType
  message: string
  code?: string
  details?: unknown
}

export interface ErrorHandlerOptions {
  logToConsole?: boolean
  showToast?: boolean
  fallbackMessage?: string
}

export interface AuthError {
  code: string
  message: string
}

// Form state management
export interface FormField<T> {
  value: T
  error?: string
  isValid: boolean
}

export interface UseFormFieldOptions<T> {
  initialValue: T
  validator?: (value: T) => string | undefined
}

// === NAVIGATION & INTERACTION TYPES ===

export interface UseKeyboardNavigationOptions {
  itemCount: number
  isOpen: boolean
  onSelect: (index: number) => void
  onClose: () => void
}

// === UI STYLE & THEME TYPES ===

// Individual variant types for backward compatibility
export interface ButtonVariant {
  base: string
  primary: string
  secondary: string
  danger: string
  success: string
  warning: string
}

export interface ContainerVariant {
  base: string
  card: string
  section: string
  modal: string
}

export interface InputVariant {
  base: string
  default: string
  error: string
  success: string
  highlighted: string
}

export interface ItemVariant {
  pending: string
  inCart: string
  purchased: string
}

// Consolidated style variants for consistent theming
export interface StyleVariants {
  button: ButtonVariant
  container: ContainerVariant
  input: InputVariant
  item: ItemVariant
}

// === PRESET & CONFIGURATION TYPES ===

export interface PresetList {
  title: string
  items: Array<{name: string, category: CategoryType}>
  icon?: string
  description?: string
}

// === USER & AUTHENTICATION TYPES ===

export interface User {
  email?: string
  id?: string
  name?: string
}

export interface AuthContextType {
  user: SupabaseUser | null
  session: Session | null | undefined
  loading: boolean
  isGuest: boolean
  signOut: () => Promise<void>
  signInAsGuest: () => void
  switchToAuth: () => void
  isAuthenticated: boolean
}

export interface HeaderState {
  soundEnabled: boolean
  user: User | null
  isGuest: boolean
  isStatisticsPage: boolean
  isAuthenticated: boolean
}

export interface HeaderActions {
  openTutorial: () => void
  openReceiptScanner: () => void
  toggleSound: () => void
  handleSignOut: () => void
  handleSwitchToAuth: () => void
}

// === SHOPPING CONTEXT & STATE TYPES ===

// Analytics data structure
export interface ShoppingAnalytics {
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: ShoppingItem[]
  priorityItems: ShoppingItem[]
}

// Shopping state structure
export interface ShoppingState {
  pendingItems: ShoppingItem[]
  cartItems: ShoppingItem[]
  purchasedItems: ShoppingItem[]
  hasItemsInCart: boolean
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
}

// Base shopping data interface
export interface ShoppingDataBase {
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
}

// Shopping actions interface
export interface ShoppingActionsBase {
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  clearCartItems: () => Promise<void>
}

// UI state management
export interface ShoppingUIState {
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  showWelcomeMessage: boolean
  welcomeUserName: string | null
  checkoutItems: ShoppingItem[]
}

// UI actions interface
export interface ShoppingUIActions {
  openReceiptScanner: () => void
  closeReceiptScanner: () => void
  openExpiryModal: (items: ShoppingItem[]) => void
  closeExpiryModal: () => void
  openDataImportModal: () => void
  closeDataImportModal: () => void
  openTutorial: () => void
  closeTutorial: () => void
  showWelcome: (userName?: string) => void
  closeWelcome: () => void
}

// Complex operations interface
export interface ShoppingComplexOperations {
  handleCheckout: () => void
  createQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  addBulkToCart: (items: Array<{name: string, category: string}>) => Promise<void>
  processReceipt: (receiptItems: ShoppingItem[], storeName: string) => void
  submitExpiryModal: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
}

// Notification interface
export interface ShoppingNotifications {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

// Sound interface
export interface ShoppingSounds {
  playAddToCart: () => void
  playRemoveFromCart: () => void
  playPurchase: () => void
  playDelete: () => void
}

// Guest mode interface
export interface ShoppingGuestMode {
  shouldShowGuestExplanation: boolean
  dismissGuestExplanation: () => void
}

// Main context interface that combines all shopping-related functionality
export interface EnhancedGlobalShoppingContextValue extends 
  ShoppingState,
  ShoppingAnalytics,
  ShoppingDataBase,
  ShoppingUIState,
  ShoppingActionsBase,
  ShoppingUIActions,
  ShoppingComplexOperations,
  ShoppingNotifications,
  ShoppingSounds,
  ShoppingGuestMode {}

// Hook return types for better separation of concerns
export interface UseShoppingDataReturn extends ShoppingDataBase, ShoppingAnalytics {}
export interface UseShoppingActionsReturn extends ShoppingActionsBase {}

// === SUPABASE TYPES ===
export * from './supabase'
