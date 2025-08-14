/**
 * Store Types - State Management and Data Stores
 * Contains all types related to Zustand stores, data management, and analytics
 */

// === AUTH STORE TYPES ===

export interface StoreUser {
  id: string
  email: string
  isGuest: boolean
}

export interface AuthState {
  user: StoreUser | null
  isLoading: boolean
  isInitialized: boolean
}

export interface AuthActions {
  setUser: (user: StoreUser | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  logout: () => void
  switchToGuestMode: () => void
  isAuthenticated: () => boolean
  isGuestMode: () => boolean
}

export type AuthStore = AuthState & AuthActions

// === SHOPPING DATA STORE TYPES ===

export interface DbShoppingItem {
  id: string
  user_id: string
  name: string
  category: string
  is_in_cart: boolean
  is_purchased: boolean
  added_at: string
  purchased_at?: string
  expiry_date?: string
  purchase_location?: string
  price?: number
  created_at: string
  updated_at: string
}

export interface ShoppingDataState {
  // === CORE DATA ===
  items: any[] // ShoppingItem[] - will be imported from main types
  suggestions: any[] // ItemSuggestion[]
  expiringItems: any[] // ExpiringItem[]
  purchaseHistory: any[] // ShoppingItem[]
  pantryItems: any[] // ShoppingItem[]
  
  // === LIST MANAGEMENT ===
  selectedListId: string | null
  
  // === FILTERS & SEARCH ===
  filters: {
    category: string | null
    showPurchased: boolean
    sortBy: 'name' | 'category' | 'addedAt' | 'expiryDate'
    sortOrder: 'asc' | 'desc'
  }
  searchQuery: string
  
  // === STATE ===
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  lastUpdated: string | null
  
  // === CORE ACTIONS ===
  initializeStore: () => Promise<void>
  refreshData: () => Promise<void>
  
  // === ITEMS CRUD ===
  addItem: (name: string, category: string, userId: string, expiryDate?: string) => Promise<any> // ShoppingItem | null
  updateItem: (id: string, updates: Partial<any>) => Promise<void> // Partial<ShoppingItem>
  deleteItem: (id: string) => Promise<void>
  
  // === CART ACTIONS ===
  addToCart: (id: string) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  toggleInCart: (id: string) => Promise<void>
  
  // === PURCHASE ACTIONS ===
  markAsPurchased: (id: string, location?: string, price?: number) => Promise<void>
  markAsUnpurchased: (id: string) => Promise<void>
  clearPurchased: () => Promise<void>
  
  // === LIST MANAGEMENT ===
  setSelectedList: (listId: string | null) => void
  
  // === FILTERS & SEARCH ===
  setSearchQuery: (query: string) => void
  updateFilters: (updates: Partial<ShoppingDataState['filters']>) => void
  resetFilters: () => void
  
  // === SUGGESTIONS ===
  updateSuggestions: () => void
  acceptSuggestion: (suggestion: any, userId: string) => Promise<void> // ItemSuggestion
  dismissSuggestion: (suggestionId: string) => void
  
  // === HELPERS ===
  clearError: () => void
  setError: (error: string) => void
}

// === ANALYTICS STORE TYPES ===

export interface CategoryStats {
  name: string
  category: string
  count: number
  percentage: number
  totalSpent: number
  averagePrice: number
  trend: 'up' | 'down' | 'stable'
}

export interface PopularItem {
  name: string
  category: string
  frequency: number
  lastBought: string
  averagePrice: number
  trend: 'up' | 'down' | 'stable'
  count: number
  lastPurchased?: Date
  daysSinceLastBought?: number
}

export interface WeeklyTrend {
  week: string
  itemCount: number
  totalSpent: number
}

export interface AnalyticsState {
  // === COMPUTED STATISTICS ===
  totalItems: number
  completionRate: number
  averageItemsPerWeek: number
  totalSpentThisMonth: number
  totalSpentLastMonth: number
  spendingTrend: 'up' | 'down' | 'stable'
  
  // === NEW ANALYTICS FIELDS ===
  totalPurchased: number
  purchasedThisWeek: number
  purchasedLastWeek: number
  expiringItemsCount: number
  totalPantryItems: number
  topCategory: string | null
  monthlyGrowth: number
  isAnalyzing: boolean
  lastAnalysisDate: Date | null
  smartSuggestions: any[] // ItemSuggestion[]
  
  // === SETTINGS ===
  suggestionSettings: {
    maxSuggestions: number
    daysSinceLastPurchase: number
    minFrequency: number
    includeSeasonalSuggestions: boolean
  }
  
  // === CATEGORY ANALYTICS ===
  categoryStats: CategoryStats[]
  topCategories: CategoryStats[]
  
  // === ITEM ANALYTICS ===
  popularItems: PopularItem[]
  recentlyAdded: any[] // ShoppingItem[]
  priorityItems: any[] // ShoppingItem[]
  expiringItems: any[] // ExpiringItem[]
  
  // === TRENDS & PATTERNS ===
  weeklyTrends: WeeklyTrend[]
  monthlySpending: Array<{ month: string; amount: number }>
  shoppingFrequency: Array<{ day: string; count: number }>
  peakShoppingDays: string[]
  
  // === PERFORMANCE METRICS ===
  averageShoppingTime: number
  itemsPerSession: number
  cartAbandonmentRate: number
  repeatPurchaseRate: number
  
  // === META DATA ===
  lastCalculated: string | null
  dataRange: {
    from: string
    to: string
  }
  sampleSize: number
}

export interface AnalyticsActions {
  // === DATA COMPUTATION ===
  calculateStats: () => void
  refreshAnalytics: (purchaseHistory?: any[], pantryItems?: any[]) => void
  
  // === NEW ANALYTICS ACTIONS ===
  analyzeShoppingData: (purchaseHistory: any[], pantryItems: any[]) => void
  generateSmartSuggestions: (purchaseHistory: any[]) => void
  calculatePopularItems: (purchaseHistory: any[]) => void
  updateCategoryStats: (purchaseHistory: any[]) => void
  
  // === SUGGESTIONS MANAGEMENT ===
  addToSuggestions: (suggestion: any) => void
  removeFromSuggestions: (suggestionName: string) => void
  clearSuggestions: () => void
  updateSuggestionSettings: (settings: any) => void
  
  // === POPULAR ITEMS ===
  refreshPopularItems: (purchaseHistory: any[]) => void
  
  // === ANALYSIS STATE ===
  setAnalyzing: (analyzing: boolean) => void
  
  // === CATEGORY ANALYTICS ===
  getCategoryInsights: (category: string) => CategoryStats | null
  getTopSpendingCategories: (limit?: number) => CategoryStats[]
  
  // === ITEM ANALYTICS ===
  getItemHistory: (itemName: string) => any[] // ShoppingItem[]
  getItemTrends: (itemName: string) => any
  getPurchasePattern: (itemName: string) => any
  
  // === EXPORT & REPORTING ===
  exportAnalytics: () => any
  generateReport: (type: 'weekly' | 'monthly' | 'yearly') => any
  
  // === UTILITIES ===
  clearAnalytics: () => void
  resetCalculations: () => void
}

export type AnalyticsStore = AnalyticsState & AnalyticsActions
