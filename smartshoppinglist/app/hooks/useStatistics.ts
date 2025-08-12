/**
 * Statistics calculations hook following DRY principles - ZERO PROPS DRILLING
 */

import { useMemo } from 'react'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { ShoppingItem, ItemSuggestion } from '../types'
import { TIME_CONSTANTS } from '../utils/appConstants'
import { 
  getDaysAgo, 
  isWithinLastDays, 
  isExpiringShortly 
} from '../utils/dateUtils'
import { 
  calculateAverage, 
  getMostFrequent, 
  countOccurrences, 
  getTopItems,
  calculateGrowth 
} from '../utils/mathUtils'

/**
 * Statistics Hook - Gets all data from context!
 */
export const useStatistics = () => {
  const { purchaseHistory, suggestions, pantryItems } = useGlobalShopping()
  
  const basicStats = useMemo(() => ({
    totalPurchased: purchaseHistory.length,
    totalSuggestions: suggestions.length,
    totalPantryItems: pantryItems.length,
  }), [purchaseHistory.length, suggestions.length, pantryItems.length])

  const weeklyStats = useMemo(() => {
    const purchasedThisWeek = purchaseHistory.filter(item => 
      item.purchasedAt && isWithinLastDays(item.purchasedAt, TIME_CONSTANTS.WEEK_IN_DAYS)
    ).length

    const purchasedLastWeek = purchaseHistory.filter(item => {
      if (!item.purchasedAt) return false
      const purchaseDate = new Date(item.purchasedAt)
      const twoWeeksAgo = getDaysAgo(TIME_CONSTANTS.TWO_WEEKS_IN_DAYS)
      const oneWeekAgo = getDaysAgo(TIME_CONSTANTS.WEEK_IN_DAYS)
      return purchaseDate >= twoWeeksAgo && purchaseDate < oneWeekAgo
    }).length

    const avgPerWeek = calculateAverage([purchasedThisWeek, purchasedLastWeek])
    
    return {
      purchasedThisWeek,
      purchasedLastWeek,
      avgPerWeek,
      weeklyGrowth: calculateGrowth(purchasedLastWeek, purchasedThisWeek),
    }
  }, [purchaseHistory])

  const categoryStats = useMemo(() => {
    const categories = purchaseHistory.map(item => item.category)
    const categoryCount = countOccurrences(categories)
    const mostPopularCategory = getMostFrequent(categories) || 'אין נתונים'
    const topCategories = getTopItems(categories, 5)
    
    return {
      categoryCount,
      mostPopularCategory,
      topCategories,
    }
  }, [purchaseHistory])

  const expiryStats = useMemo(() => {
    const expiringShortly = pantryItems.filter(item => 
      item.expiryDate && isExpiringShortly(item.expiryDate)
    ).length

    const expiredItems = pantryItems.filter(item => {
      if (!item.expiryDate) return false
      return new Date(item.expiryDate) < new Date()
    }).length

    return {
      expiringShortly,
      expiredItems,
    }
  }, [pantryItems])

  const trendAnalysis = useMemo(() => {
    // Analyze purchase patterns over time
    const monthlyData: Record<string, number> = {}
    
    purchaseHistory.forEach(item => {
      if (item.purchasedAt) {
        const month = new Date(item.purchasedAt).toISOString().slice(0, 7) // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + 1
      }
    })

    const months = Object.keys(monthlyData).sort()
    const isIncreasingTrend = months.length >= 2 && 
      monthlyData[months[months.length - 1]] > monthlyData[months[months.length - 2]]

    return {
      monthlyData,
      isIncreasingTrend,
      totalMonths: months.length,
    }
  }, [purchaseHistory])

  const insights = useMemo(() => {
    const insights: string[] = []

    if (weeklyStats.weeklyGrowth > 20) {
      insights.push('📈 עלייה משמעותית בקניות השבוע')
    } else if (weeklyStats.weeklyGrowth < -20) {
      insights.push('📉 ירידה בקניות השבוע')
    }

    if (expiryStats.expiringShortly > 0) {
      insights.push(`⚠️ ${expiryStats.expiringShortly} מוצרים עומדים לפוג`)
    }

    if (categoryStats.topCategories.length > 0) {
      const topCategory = categoryStats.topCategories[0]
      insights.push(`🏆 הקטגוריה הפופולרית: ${topCategory.item}`)
    }

    if (trendAnalysis.isIncreasingTrend) {
      insights.push('📊 מגמת קניות עולה')
    }

    return insights
  }, [weeklyStats, expiryStats, categoryStats, trendAnalysis])

  return {
    basicStats,
    weeklyStats,
    categoryStats,
    expiryStats,
    trendAnalysis,
    insights,
  }
}
