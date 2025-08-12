import { useEffect } from 'react'
import { useAnalyticsStore } from '../stores/analyticsStore'
import { ShoppingItem } from '../types'

/**
 * Custom hook for managing analytics and insights
 * Automatically refreshes data when shopping items change
 */
export const useAnalytics = (purchaseHistory: ShoppingItem[], pantryItems: ShoppingItem[]) => {
  const store = useAnalyticsStore()
  
  // Auto-refresh analytics when data changes
  useEffect(() => {
    if (purchaseHistory.length > 0 || pantryItems.length > 0) {
      store.refreshAnalytics(purchaseHistory, pantryItems)
    }
  }, [purchaseHistory, pantryItems, store.refreshAnalytics])
  
  // Return all analytics data and actions
  return {
    // Analytics data
    smartSuggestions: store.smartSuggestions,
    popularItems: store.popularItems,
    categoryStats: store.categoryStats,
    weeklyStats: {
      thisWeek: store.purchasedThisWeek,
      lastWeek: store.purchasedLastWeek,
      growth: store.purchasedThisWeek - store.purchasedLastWeek
    },
    
    // Summary stats
    totalPurchased: store.totalPurchased,
    totalPantryItems: store.totalPantryItems,
    expiringItemsCount: store.expiringItemsCount,
    topCategory: store.topCategory,
    
    // Loading state
    isAnalyzing: store.isAnalyzing,
    lastAnalysisDate: store.lastAnalysisDate,
    
    // Actions
    refreshAnalytics: () => store.refreshAnalytics(purchaseHistory, pantryItems),
    addSuggestion: store.addToSuggestions,
    removeSuggestion: store.removeFromSuggestions,
    clearSuggestions: store.clearSuggestions,
    updateSettings: store.updateSuggestionSettings,
    
    // Settings
    suggestionSettings: store.suggestionSettings,
  }
}

/**
 * Hook for smart suggestions only
 */
export const useSmartSuggestionsHook = () => {
  const suggestions = useAnalyticsStore(state => state.smartSuggestions)
  const isAnalyzing = useAnalyticsStore(state => state.isAnalyzing)
  const generateSuggestions = useAnalyticsStore(state => state.generateSmartSuggestions)
  const addSuggestion = useAnalyticsStore(state => state.addToSuggestions)
  const removeSuggestion = useAnalyticsStore(state => state.removeFromSuggestions)
  
  return {
    suggestions,
    isAnalyzing,
    generateSuggestions,
    addSuggestion,
    removeSuggestion,
  }
}

/**
 * Hook for popular items (quick add)
 */
export const usePopularItemsHook = () => {
  const popularItems = useAnalyticsStore(state => state.popularItems)
  const isAnalyzing = useAnalyticsStore(state => state.isAnalyzing)
  const refreshPopularItems = useAnalyticsStore(state => state.refreshPopularItems)
  
  return {
    popularItems,
    isAnalyzing,
    refreshPopularItems,
  }
}

/**
 * Hook for category statistics
 */
export const useCategoryAnalytics = () => {
  const categoryStats = useAnalyticsStore(state => state.categoryStats)
  const topCategory = useAnalyticsStore(state => state.topCategory)
  const updateCategoryStats = useAnalyticsStore(state => state.updateCategoryStats)
  
  return {
    categoryStats,
    topCategory,
    updateCategoryStats,
  }
}

/**
 * Hook for weekly/trend analytics
 */
export const useWeeklyAnalytics = () => {
  const purchasedThisWeek = useAnalyticsStore(state => state.purchasedThisWeek)
  const purchasedLastWeek = useAnalyticsStore(state => state.purchasedLastWeek)
  const weeklyTrends = useAnalyticsStore(state => state.weeklyTrends)
  const monthlyGrowth = useAnalyticsStore(state => state.monthlyGrowth)
  
  const growth = purchasedThisWeek - purchasedLastWeek
  const growthPercentage = purchasedLastWeek > 0 
    ? Math.round((growth / purchasedLastWeek) * 100) 
    : 0
  
  return {
    thisWeek: purchasedThisWeek,
    lastWeek: purchasedLastWeek,
    growth,
    growthPercentage,
    weeklyTrends,
    monthlyGrowth,
    trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'
  }
}

/**
 * Hook for expiry analytics
 */
export const useExpiryAnalytics = () => {
  const expiringItemsCount = useAnalyticsStore(state => state.expiringItemsCount)
  const totalPantryItems = useAnalyticsStore(state => state.totalPantryItems)
  
  const expiryRate = totalPantryItems > 0 
    ? Math.round((expiringItemsCount / totalPantryItems) * 100)
    : 0
    
  return {
    expiringItemsCount,
    totalPantryItems,
    expiryRate,
    hasExpiringItems: expiringItemsCount > 0,
  }
}
