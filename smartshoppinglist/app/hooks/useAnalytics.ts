import { useEffect } from 'react'
import { useAnalyticsStore } from '../stores/data/analyticsStore'
import { ShoppingItem } from '../types'

/**
 * Main analytics hook for managing analytics and insights
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
    
    // State
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
 * Specialized hook for smart suggestions management
 */
export const useSmartSuggestions = () => {
  const {
    smartSuggestions: suggestions,
    isAnalyzing,
    generateSmartSuggestions: generateSuggestions,
    addToSuggestions: addSuggestion,
    removeFromSuggestions: removeSuggestion,
  } = useAnalyticsStore()
  
  return {
    suggestions,
    isAnalyzing,
    generateSuggestions,
    addSuggestion,
    removeSuggestion,
  }
}

/**
 * Specialized hook for popular items (quick add functionality)
 */
export const usePopularItems = () => {
  const {
    popularItems,
    isAnalyzing,
    refreshPopularItems,
  } = useAnalyticsStore()
  
  return {
    popularItems,
    isAnalyzing,
    refreshPopularItems,
  }
}

/**
 * Specialized hook for category analytics
 */
export const useCategoryAnalytics = () => {
  const {
    categoryStats,
    topCategory,
    updateCategoryStats,
  } = useAnalyticsStore()
  
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
