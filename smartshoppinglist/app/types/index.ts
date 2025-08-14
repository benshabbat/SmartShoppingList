// === CORE ENTITIES ===
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

// Legacy CategoryType for categories.ts - will be unified later
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
  items: Array<{name: string, category: Category}>
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
