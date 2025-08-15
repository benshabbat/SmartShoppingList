/**
 * Analytics Store
 * Handles shopping analytics, statistics, and smart suggestions
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ItemSuggestion, CategoryStats, PopularItem, AnalyticsState, AnalyticsStore } from '../../types'

// Helper functions
const getDaysSinceDate = (date: Date): number => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const _getWeekKey = (date: Date): string => {
  const year = date.getFullYear()
  const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7)
  return `${year}-W${week}`
}

const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  const change = ((current - previous) / previous) * 100
  if (change > 5) return 'up'
  if (change < -5) return 'down'
  return 'stable'
}

// Initial State
const initialState: AnalyticsState = {
  // === COMPUTED STATISTICS ===
  totalItems: 0,
  completionRate: 0,
  averageItemsPerWeek: 0,
  totalSpentThisMonth: 0,
  totalSpentLastMonth: 0,
  spendingTrend: 'stable',
  
  // === NEW ANALYTICS FIELDS ===
  totalPurchased: 0,
  purchasedThisWeek: 0,
  purchasedLastWeek: 0,
  expiringItemsCount: 0,
  totalPantryItems: 0,
  topCategory: null,
  monthlyGrowth: 0,
  isAnalyzing: false,
  lastAnalysisDate: null,
  smartSuggestions: [],
  
  // === SETTINGS ===
  suggestionSettings: {
    maxSuggestions: 10,
    daysSinceLastPurchase: 7,
    minFrequency: 2,
    includeSeasonalSuggestions: true,
  },
  
  // === CATEGORY ANALYTICS ===
  categoryStats: [],
  topCategories: [],
  
  // === ITEM ANALYTICS ===
  popularItems: [],
  recentlyAdded: [],
  priorityItems: [],
  expiringItems: [],
  
  // === TRENDS & PATTERNS ===
  weeklyTrends: [],
  monthlySpending: [],
  shoppingFrequency: [],
  peakShoppingDays: [],
  
  // === PERFORMANCE METRICS ===
  averageShoppingTime: 0,
  itemsPerSession: 0,
  cartAbandonmentRate: 0,
  repeatPurchaseRate: 0,
  
  // === META DATA ===
  lastCalculated: null,
  dataRange: {
    from: new Date().toISOString(),
    to: new Date().toISOString()
  },
  sampleSize: 0,
}

// Store Implementation
export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // === ANALYSIS ACTIONS ===
        analyzeShoppingData: (purchaseHistory, pantryItems) => {
          set((state) => {
            state.isAnalyzing = true
          })

          try {
            const { generateSmartSuggestions, calculatePopularItems, updateCategoryStats } = get()
            
            // Generate suggestions
            generateSmartSuggestions(purchaseHistory)
            
            // Calculate popular items
            calculatePopularItems(purchaseHistory)
            
            // Update category stats
            updateCategoryStats(purchaseHistory)

            // Calculate basic statistics
            const now = new Date()
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

            const purchasedThisWeek = purchaseHistory.filter(
              item => item.purchasedAt && item.purchasedAt >= oneWeekAgo
            ).length

            const purchasedLastWeek = purchaseHistory.filter(
              item => item.purchasedAt && 
                     item.purchasedAt >= twoWeeksAgo && 
                     item.purchasedAt < oneWeekAgo
            ).length

            set((state) => {
              state.totalPurchased = purchaseHistory.length
              state.purchasedThisWeek = purchasedThisWeek
              state.purchasedLastWeek = purchasedLastWeek
              state.totalPantryItems = pantryItems.length
              state.expiringItemsCount = pantryItems.filter(
                item => item.expiryDate && getDaysSinceDate(item.expiryDate) <= 3
              ).length
              state.lastAnalysisDate = new Date()
              state.isAnalyzing = false
            })

          } catch (error) {
            console.error('Error analyzing shopping patterns:', error)
            set((state) => {
              state.isAnalyzing = false
            })
          }
        },

        generateSmartSuggestions: (purchaseHistory) => {
          const { suggestionSettings } = get()
          const suggestions: ItemSuggestion[] = []

          // Group items by name
          const itemFrequency: Record<string, { count: number; lastPurchased: Date; category: string }> = {}
          
          purchaseHistory.forEach(item => {
            if (item.purchasedAt) {
              const key = item.name.toLowerCase()
              if (!itemFrequency[key]) {
                itemFrequency[key] = {
                  count: 0,
                  lastPurchased: item.purchasedAt,
                  category: item.category
                }
              }
              itemFrequency[key].count++
              if (item.purchasedAt > itemFrequency[key].lastPurchased) {
                itemFrequency[key].lastPurchased = item.purchasedAt
              }
            }
          })

          // Generate suggestions based on frequency and recency
          Object.entries(itemFrequency).forEach(([name, data]) => {
            const daysSinceLastPurchase = getDaysSinceDate(data.lastPurchased)
            
            if (
              data.count >= suggestionSettings.minFrequency &&
              daysSinceLastPurchase >= suggestionSettings.daysSinceLastPurchase
            ) {
              suggestions.push({
                id: `suggestion-${name}-${Date.now()}`, // Generate unique ID
                name: name.charAt(0).toUpperCase() + name.slice(1),
                category: data.category,
                frequency: data.count,
                daysSinceLastBought: daysSinceLastPurchase,
                confidence: Math.min(0.9, data.count * 0.1 + (daysSinceLastPurchase / 30) * 0.5)
              })
            }
          })

          // Sort by confidence and limit
          suggestions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
          const limitedSuggestions = suggestions.slice(0, suggestionSettings.maxSuggestions)

          set((state) => {
            state.smartSuggestions = limitedSuggestions
          })
        },

        calculatePopularItems: (purchaseHistory) => {
          const itemStats: Record<string, PopularItem> = {}

          purchaseHistory.forEach(item => {
            if (item.purchasedAt) {
              const key = item.name.toLowerCase()
              if (!itemStats[key]) {
                itemStats[key] = {
                  name: item.name,
                  category: item.category,
                  count: 0,
                  lastPurchased: item.purchasedAt,
                  lastBought: item.purchasedAt.toISOString(),
                  frequency: 0,
                  daysSinceLastBought: 0,
                  averagePrice: item.price || 0,
                  trend: 'stable' as const,
                }
              }
              itemStats[key].count++
              if (item.purchasedAt > (itemStats[key].lastPurchased || new Date(0))) {
                itemStats[key].lastPurchased = item.purchasedAt
              }
            }
          })

          // Calculate frequency and days since last bought
          const popularItems = Object.values(itemStats).map(item => ({
            ...item,
            frequency: item.count / purchaseHistory.length,
            daysSinceLastBought: item.lastPurchased ? getDaysSinceDate(item.lastPurchased) : 999,
          }))

          // Sort by count descending
          popularItems.sort((a, b) => b.count - a.count)

          set((state) => {
            state.popularItems = popularItems.slice(0, 20) // Top 20 items
          })
        },

        updateCategoryStats: (purchaseHistory) => {
          const categoryCount: Record<string, number> = {}
          const categoryLastWeek: Record<string, number> = {}

          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

          purchaseHistory.forEach(item => {
            // Count all purchases
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1

            // Count last week purchases
            if (item.purchasedAt && item.purchasedAt >= oneWeekAgo) {
              categoryLastWeek[item.category] = (categoryLastWeek[item.category] || 0) + 1
            }
          })

          const total = purchaseHistory.length
          const categoryStats: CategoryStats[] = Object.entries(categoryCount).map(([category, count]) => ({
            name: category,
            category,
            count,
            percentage: (count / total) * 100,
            lastWeekCount: categoryLastWeek[category] || 0,
            trend: calculateTrend(categoryLastWeek[category] || 0, count - (categoryLastWeek[category] || 0)),
            totalSpent: 0,
            averagePrice: 0,
          }))

          // Sort by count descending
          categoryStats.sort((a, b) => b.count - a.count)

          set((state) => {
            state.categoryStats = categoryStats
            state.topCategory = categoryStats.length > 0 ? categoryStats[0].category : null
          })
        },

        // === SUGGESTION MANAGEMENT ===
        addToSuggestions: (suggestion) =>
          set((state) => {
            const exists = state.smartSuggestions.some(s => s.name.toLowerCase() === suggestion.name.toLowerCase())
            if (!exists) {
              state.smartSuggestions.push(suggestion)
            }
          }),

        removeFromSuggestions: (suggestionName) =>
          set((state) => {
            state.smartSuggestions = state.smartSuggestions.filter(
              s => s.name.toLowerCase() !== suggestionName.toLowerCase()
            )
          }),

        clearSuggestions: () =>
          set((state) => {
            state.smartSuggestions = []
          }),

        // === POPULAR ITEMS MANAGEMENT ===
        refreshPopularItems: (purchaseHistory) => {
          get().calculatePopularItems(purchaseHistory)
        },

        // === SETTINGS ===
        updateSuggestionSettings: (settings) =>
          set((state) => {
            state.suggestionSettings = { ...state.suggestionSettings, ...settings }
          }),

        // === MANUAL REFRESH ===
        refreshAnalytics: (purchaseHistory, pantryItems) => {
          get().analyzeShoppingData(purchaseHistory || [], pantryItems || [])
        },

        setAnalyzing: (analyzing) =>
          set((state) => {
            state.isAnalyzing = analyzing
          }),

        // === COMPUTED VALUES ===
        getTopCategories: (limit = 5) => {
          const { categoryStats } = get()
          return categoryStats.slice(0, limit)
        },

        getMostFrequentItems: (limit = 10) => {
          const { popularItems } = get()
          return popularItems.slice(0, limit)
        },

        getRecentTrends: (weeks = 4) => {
          const { weeklyTrends } = get()
          return weeklyTrends.slice(-weeks)
        },

        // Missing functions
        calculateStats: () => {},
        getCategoryInsights: (category: string) => get().categoryStats.find(c => c.category === category) || null,
        getTopSpendingCategories: () => [],
        getItemHistory: () => [],
        generateShoppingPredictions: () => [],
        updateAnalysisSettings: () => {},
        exportAnalyticsData: () => ({}),
        importAnalyticsData: () => {},
        resetAnalytics: () => {},
        getMonthlyStatistics: () => ({}),
        getItemTrends: () => [],
        getPurchasePattern: () => ({ frequency: 0, averageDays: 0 }),
        exportAnalytics: () => '',
        generateReport: () => ({ 
          type: 'monthly' as const,
          period: { from: new Date(), to: new Date() }, 
          summary: { totalItems: 0, totalSpent: 0, completionRate: 0 }, 
          categories: [], 
          items: [], 
          insights: [],
          trends: [],
          popularItems: []
        }),
        clearAnalytics: () => {},
        resetCalculations: () => {},
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

// Selectors for better performance - These ARE React hooks
export const useAnalyticsSelectors = {
  useSuggestions: () => useAnalyticsStore((state) => state.smartSuggestions),
  usePopularItems: () => useAnalyticsStore((state) => state.popularItems),
  useStatistics: () => useAnalyticsStore((state) => ({
    totalPurchased: state.totalPurchased,
    purchasedThisWeek: state.purchasedThisWeek,
    purchasedLastWeek: state.purchasedLastWeek,
    expiringItemsCount: state.expiringItemsCount,
    totalPantryItems: state.totalPantryItems,
  })),
  useCategoryStats: () => useAnalyticsStore((state) => state.categoryStats),
  useTopCategory: () => useAnalyticsStore((state) => state.topCategory),
  useTrends: () => useAnalyticsStore((state) => state.weeklyTrends),
  useIsAnalyzing: () => useAnalyticsStore((state) => state.isAnalyzing),
  useSettings: () => useAnalyticsStore((state) => state.suggestionSettings),
}
