import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ShoppingItem, ItemSuggestion } from '../types'

// Analytics Store Types
interface CategoryStats {
  category: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  lastWeekCount: number
}

interface PopularItem {
  name: string
  category: string
  count: number
  lastPurchased?: Date
  frequency: number
  daysSinceLastBought: number
}

interface WeeklyTrend {
  week: string
  purchases: number
  categories: Record<string, number>
}

interface AnalyticsState {
  // Suggestions and recommendations
  smartSuggestions: ItemSuggestion[]
  popularItems: PopularItem[]
  
  // Statistics
  totalPurchased: number
  purchasedThisWeek: number
  purchasedLastWeek: number
  expiringItemsCount: number
  totalPantryItems: number
  
  // Category analytics
  categoryStats: CategoryStats[]
  topCategory: string | null
  
  // Trends
  weeklyTrends: WeeklyTrend[]
  monthlyGrowth: number
  
  // Loading states
  isAnalyzing: boolean
  lastAnalysisDate: Date | null
  
  // Settings
  suggestionSettings: {
    maxSuggestions: number
    daysSinceLastPurchase: number
    minFrequency: number
    includeSeasonalSuggestions: boolean
  }
}

interface AnalyticsActions {
  // Analysis actions
  analyzeShoppingData: (purchaseHistory: ShoppingItem[], pantryItems: ShoppingItem[]) => void
  generateSmartSuggestions: (purchaseHistory: ShoppingItem[]) => void
  calculatePopularItems: (purchaseHistory: ShoppingItem[]) => void
  updateCategoryStats: (purchaseHistory: ShoppingItem[]) => void
  
  // Suggestion management
  addToSuggestions: (suggestion: ItemSuggestion) => void
  removeFromSuggestions: (suggestionName: string) => void
  clearSuggestions: () => void
  
  // Popular items management
  refreshPopularItems: (purchaseHistory: ShoppingItem[]) => void
  
  // Settings
  updateSuggestionSettings: (settings: Partial<AnalyticsState['suggestionSettings']>) => void
  
  // Manual refresh
  refreshAnalytics: (purchaseHistory: ShoppingItem[], pantryItems: ShoppingItem[]) => void
  setAnalyzing: (analyzing: boolean) => void
}

type AnalyticsStore = AnalyticsState & AnalyticsActions

const initialState: AnalyticsState = {
  smartSuggestions: [],
  popularItems: [],
  totalPurchased: 0,
  purchasedThisWeek: 0,
  purchasedLastWeek: 0,
  expiringItemsCount: 0,
  totalPantryItems: 0,
  categoryStats: [],
  topCategory: null,
  weeklyTrends: [],
  monthlyGrowth: 0,
  isAnalyzing: false,
  lastAnalysisDate: null,
  suggestionSettings: {
    maxSuggestions: 5,
    daysSinceLastPurchase: 7,
    minFrequency: 2,
    includeSeasonalSuggestions: true,
  },
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Main analysis function
        analyzeShoppingData: (purchaseHistory, pantryItems) =>
          set((state) => {
            state.isAnalyzing = true
            
            // Basic stats
            state.totalPurchased = purchaseHistory.length
            state.totalPantryItems = pantryItems.length
            
            // Weekly analysis
            const now = new Date()
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
            
            state.purchasedThisWeek = purchaseHistory.filter(item => 
              item.purchasedAt && new Date(item.purchasedAt) >= weekAgo
            ).length
            
            state.purchasedLastWeek = purchaseHistory.filter(item => 
              item.purchasedAt && 
              new Date(item.purchasedAt) >= twoWeeksAgo && 
              new Date(item.purchasedAt) < weekAgo
            ).length
            
            // Expiring items count
            state.expiringItemsCount = pantryItems.filter(item => {
              if (!item.expiryDate) return false
              const expiryDate = new Date(item.expiryDate)
              const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
            }).length
            
            state.lastAnalysisDate = now
            state.isAnalyzing = false
          }),

        // Generate smart suggestions based on purchase history
        generateSmartSuggestions: (purchaseHistory) =>
          set((state) => {
            const { maxSuggestions, daysSinceLastPurchase, minFrequency } = state.suggestionSettings
            const now = new Date()
            
            // Group items by name and calculate frequency
            const itemFrequency: Record<string, {
              count: number
              lastPurchased: Date
              category: string
            }> = {}
            
            purchaseHistory.forEach(item => {
              if (item.purchasedAt) {
                const key = item.name.toLowerCase()
                if (!itemFrequency[key]) {
                  itemFrequency[key] = {
                    count: 0,
                    lastPurchased: new Date(item.purchasedAt),
                    category: item.category
                  }
                }
                itemFrequency[key].count++
                const itemDate = new Date(item.purchasedAt)
                if (itemDate > itemFrequency[key].lastPurchased) {
                  itemFrequency[key].lastPurchased = itemDate
                }
              }
            })
            
            // Generate suggestions
            const suggestions: ItemSuggestion[] = []
            
            Object.entries(itemFrequency).forEach(([name, data]) => {
              const daysSince = Math.floor((now.getTime() - data.lastPurchased.getTime()) / (1000 * 60 * 60 * 24))
              
              if (data.count >= minFrequency && daysSince >= daysSinceLastPurchase) {
                suggestions.push({
                  name: name.charAt(0).toUpperCase() + name.slice(1),
                  frequency: data.count,
                  daysSinceLastBought: daysSince,
                  category: data.category,
                  confidence: Math.min(100, (data.count * 20) + Math.max(0, 50 - daysSince))
                })
              }
            })
            
            // Sort by confidence and limit
            state.smartSuggestions = suggestions
              .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
              .slice(0, maxSuggestions)
          }),

        // Calculate popular items for quick add
        calculatePopularItems: (purchaseHistory) =>
          set((state) => {
            const itemCount: Record<string, PopularItem> = {}
            const now = new Date()
            
            purchaseHistory.forEach(item => {
              const key = `${item.name}-${item.category}`
              if (!itemCount[key]) {
                itemCount[key] = {
                  name: item.name,
                  category: item.category,
                  count: 0,
                  frequency: 0,
                  daysSinceLastBought: 0
                }
              }
              itemCount[key].count++
              
              if (item.purchasedAt) {
                const itemDate = new Date(item.purchasedAt)
                if (!itemCount[key].lastPurchased || itemDate > itemCount[key].lastPurchased) {
                  itemCount[key].lastPurchased = itemDate
                  itemCount[key].daysSinceLastBought = Math.floor(
                    (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
                  )
                }
              }
            })
            
            // Calculate frequency and sort
            Object.values(itemCount).forEach(item => {
              item.frequency = item.count
            })
            
            state.popularItems = Object.values(itemCount)
              .sort((a, b) => b.count - a.count)
              .slice(0, 10) // Top 10 popular items
          }),

        // Update category statistics
        updateCategoryStats: (purchaseHistory) =>
          set((state) => {
            const categoryCount: Record<string, number> = {}
            const categoryLastWeek: Record<string, number> = {}
            
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            
            purchaseHistory.forEach(item => {
              // All time count
              categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
              
              // Last week count
              if (item.purchasedAt && new Date(item.purchasedAt) >= weekAgo) {
                categoryLastWeek[item.category] = (categoryLastWeek[item.category] || 0) + 1
              }
            })
            
            const total = purchaseHistory.length
            const stats: CategoryStats[] = Object.entries(categoryCount).map(([category, count]) => {
              const lastWeekCount = categoryLastWeek[category] || 0
              const previousWeekCount = count - lastWeekCount
              
              let trend: 'up' | 'down' | 'stable' = 'stable'
              if (lastWeekCount > previousWeekCount) trend = 'up'
              else if (lastWeekCount < previousWeekCount) trend = 'down'
              
              return {
                category,
                count,
                percentage: Math.round((count / total) * 100),
                trend,
                lastWeekCount
              }
            }).sort((a, b) => b.count - a.count)
            
            state.categoryStats = stats
            state.topCategory = stats.length > 0 ? stats[0].category : null
          }),

        // Suggestion management
        addToSuggestions: (suggestion) =>
          set((state) => {
            const exists = state.smartSuggestions.find(s => s.name === suggestion.name)
            if (!exists) {
              state.smartSuggestions.push(suggestion)
            }
          }),

        removeFromSuggestions: (suggestionName) =>
          set((state) => {
            state.smartSuggestions = state.smartSuggestions.filter(s => s.name !== suggestionName)
          }),

        clearSuggestions: () =>
          set((state) => {
            state.smartSuggestions = []
          }),

        // Popular items management
        refreshPopularItems: (purchaseHistory) => {
          get().calculatePopularItems(purchaseHistory)
        },

        // Settings
        updateSuggestionSettings: (settings) =>
          set((state) => {
            Object.assign(state.suggestionSettings, settings)
          }),

        // Manual refresh
        refreshAnalytics: (purchaseHistory, pantryItems) => {
          const actions = get()
          actions.setAnalyzing(true)
          actions.analyzeShoppingData(purchaseHistory, pantryItems)
          actions.generateSmartSuggestions(purchaseHistory)
          actions.calculatePopularItems(purchaseHistory)
          actions.updateCategoryStats(purchaseHistory)
          actions.setAnalyzing(false)
        },

        setAnalyzing: (analyzing) =>
          set((state) => {
            state.isAnalyzing = analyzing
          }),
      })),
      {
        name: 'analytics-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          suggestionSettings: state.suggestionSettings,
          lastAnalysisDate: state.lastAnalysisDate,
        }),
      }
    ),
    {
      name: 'analytics-store',
    }
  )
)

// Selector hooks for optimized re-renders
export const useSmartSuggestions = () => useAnalyticsStore((state) => state.smartSuggestions)
export const usePopularItems = () => useAnalyticsStore((state) => state.popularItems)
export const useCategoryStats = () => useAnalyticsStore((state) => state.categoryStats)
export const useAnalyticsLoading = () => useAnalyticsStore((state) => state.isAnalyzing)
export const useWeeklyStats = () => useAnalyticsStore((state) => ({
  thisWeek: state.purchasedThisWeek,
  lastWeek: state.purchasedLastWeek,
  growth: state.purchasedThisWeek - state.purchasedLastWeek
}))
export const useExpiringItems = () => useAnalyticsStore((state) => state.expiringItemsCount)
