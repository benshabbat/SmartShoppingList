import { User as SupabaseUser, Session } from '@supabase/supabase-js'

// === UI COMPONENTS TYPES ===

// Tutorial types
export interface TutorialStep {
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

// Toast types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
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
  type: 'success' | 'error' | 'info'
}

// Notification Banner types
export interface NotificationBannerProps {
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

export interface ItemActionsProps {
  variant: 'pending' | 'inCart' | 'purchased'
  onToggleCart: () => void
  onRemove: () => void
  className?: string
  disabled?: boolean
}

// Shopping Item Component types
export interface ShoppingItemComponentProps {
  item: ShoppingItem
  className?: string
}

export interface ShoppingItemUIProps {
  item: ShoppingItem
  variant?: 'pending' | 'inCart' | 'purchased'
}

export interface UseShoppingItemLogicProps {
  item: ShoppingItem
  variant?: 'pending' | 'inCart' | 'purchased'
}

// Suggestion Item types
export interface SuggestionItemProps {
  suggestion: string
  isHighlighted: boolean
  onClick: () => void
}

// Loading Overlay types
export interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

// Interactive Emoji types
export interface InteractiveEmojiProps {
  emoji: string
  className?: string
  onClick?: () => void
  disabled?: boolean
}

// Auth Context types
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

// Login Form Component types
export interface AuthHeaderProps {
  isLogin: boolean
  className?: string
}

export interface BrandHeaderProps {
  className?: string
}

export interface FormFieldProps {
  label: string
  type: 'email' | 'password' | 'text'
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  minLength?: number
  className?: string
}

export interface AlertProps {
  message: string
  type: 'error' | 'success' | 'info'
  className?: string
}

export interface SeparatorProps {
  text: string
  className?: string
}

export interface GuestModeSectionProps {
  onGuestLogin: () => void
}

export interface AccountBenefitsSectionProps {
  className?: string
}

// ExpiryDateModal types
export interface ExpiryDateModalUIProps {
  items: ShoppingItem[]
  isOpen: boolean
  
  // State
  expiryDates: Record<string, string>
  skippedItems: Set<string>
  
  // Computed values
  today: string
  quickDateOptions: Array<{ label: string; days: number }>
  hasAnyDates: boolean
  allItemsProcessed: boolean
  
  // Event handlers
  onClose: () => void
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
export interface ActionButtonProps {
  onClick: () => void
  icon: any // LucideIcon
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  iconSize?: number
}

// === EXISTING TYPES ===
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

// Category Type for utils/categories.ts
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

// === VALIDATION TYPES ===
export interface ValidationResult {
  isValid: boolean
  error?: string
  errors?: string[]
}

export type Validator<T> = (value: T) => ValidationResult

// === ERROR HANDLING TYPES ===
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

// === FORM TYPES ===
export interface FormField<T> {
  value: T
  error?: string
  isValid: boolean
}

export interface UseFormFieldOptions<T> {
  initialValue: T
  validator?: (value: T) => string | undefined
}

// === NAVIGATION TYPES ===
export interface UseKeyboardNavigationOptions {
  itemCount: number
  isOpen: boolean
  onSelect: (index: number) => void
  onClose: () => void
}

// === UI STYLE TYPES ===
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

// === PRESET LISTS TYPES ===
export interface PresetList {
  title: string
  items: Array<{name: string, category: CategoryType}>
  icon?: string
  description?: string
}

// === USER & HEADER TYPES ===
export interface User {
  email?: string
  id?: string
  name?: string
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

// === SHOPPING CONTEXT TYPES ===
export interface ShoppingAnalytics {
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: ShoppingItem[]
  priorityItems: ShoppingItem[]
}

export interface ShoppingState {
  pendingItems: ShoppingItem[]
  cartItems: ShoppingItem[]
  purchasedItems: ShoppingItem[]
  hasItemsInCart: boolean
  hasExpiringItems: boolean
  hasPurchaseHistory: boolean
  isPantryEmpty: boolean
}

export interface EnhancedGlobalShoppingContextValue extends ShoppingState, ShoppingAnalytics {
  // === DATA ACCESS ===
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
  
  // === UI STATE ===
  showReceiptScanner: boolean
  showExpiryModal: boolean
  showDataImportModal: boolean
  showTutorial: boolean
  showWelcomeMessage: boolean
  welcomeUserName: string | null
  checkoutItems: ShoppingItem[]
  
  // === CORE ACTIONS ===
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  clearCartItems: () => Promise<void>
  
  // === UI ACTIONS ===
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
  
  // === COMPLEX OPERATIONS ===
  handleCheckout: () => void
  createQuickList: (items: Array<{name: string, category: string}>) => Promise<void>
  addBulkToCart: (items: Array<{name: string, category: string}>) => Promise<void>
  processReceipt: (receiptItems: ShoppingItem[], storeName: string) => void
  submitExpiryModal: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
  
  // === GUEST MODE ===
  shouldShowGuestExplanation: boolean
  dismissGuestExplanation: () => void
  
  // === NOTIFICATIONS ===
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  
  // === SOUNDS ===
  playAddToCart: () => void
  playRemoveFromCart: () => void
  playPurchase: () => void
  playDelete: () => void
}

export interface UseShoppingDataReturn {
  items: ShoppingItem[]
  suggestions: ItemSuggestion[]
  expiringItems: ExpiringItem[]
  purchaseHistory: ShoppingItem[]
  pantryItems: ShoppingItem[]
  loading: boolean
  error: string | null
  totalItems: number
  completionRate: number
  categoryStats: Record<string, number>
  recentlyAdded: ShoppingItem[]
}

export interface UseShoppingActionsReturn {
  addItem: (itemName: string, category: string, addToCart?: boolean) => Promise<void>
  toggleItemInCart: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearPurchasedItems: () => Promise<void>
  clearCartItems: () => Promise<void>
}

// === SUPABASE TYPES ===
export * from './supabase'
