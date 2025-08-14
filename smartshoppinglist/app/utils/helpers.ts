import { ShoppingItem, ItemSuggestion, ExpiringItem } from '../types'

/**
 * Enhanced logger for development and debugging
 */
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️ ${message}`, data ? data : '')
    }
  },
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${message}`, error ? error : '')
    }
  },
  success: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, data ? data : '')
    }
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ ${message}`, data ? data : '')
    }
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG === 'true') {
      console.log(`🐛 ${message}`, data ? data : '')
    }
  }
}

/**
 * Date and math utilities for common calculations
 */
export const calculations = {
  daysBetween: (date1: Date, date2: Date): number => {
    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
  },
  daysUntil: (targetDate: Date | string): number => {
    const target = new Date(targetDate)
    const now = new Date()
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  },
  percentage: (value: number, total: number): number => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  },
  progress: (current: number, total: number): number => {
    return Math.round((current / total) * 100)
  }
}

export const getExpiryColor = (daysUntilExpiry: number) => {
  if (daysUntilExpiry <= 0) return 'text-red-700 bg-red-50 border-red-200'
  if (daysUntilExpiry === 1) return 'text-orange-700 bg-orange-50 border-orange-200'
  if (daysUntilExpiry <= 3) return 'text-yellow-700 bg-yellow-50 border-yellow-200'
  return 'text-green-700 bg-green-50 border-green-200'
}

export const generateSuggestions = (
  history: ShoppingItem[], 
  currentItems: ShoppingItem[]
): ItemSuggestion[] => {
  const itemFrequency: Record<string, { count: number; lastBought: Date }> = {}
  
  history.forEach(item => {
    const itemName = item.name.toLowerCase()
    if (itemFrequency[itemName]) {
      itemFrequency[itemName].count++
      if (new Date(item.purchasedAt!) > itemFrequency[itemName].lastBought) {
        itemFrequency[itemName].lastBought = new Date(item.purchasedAt!)
      }
    } else {
      itemFrequency[itemName] = {
        count: 1,
        lastBought: new Date(item.purchasedAt!)
      }
    }
  })

  const now = new Date()
  return Object.entries(itemFrequency)
    .map(([name, data]) => {
      const daysSince = calculations.daysBetween(data.lastBought, now)
      return {
        id: name, // Use name as a unique id, or generate a hash if needed
        name,
        frequency: data.count,
        lastBought: data.lastBought,
        daysSinceLastBought: daysSince
      }
    })
    .filter(suggestion => {
      const isInCurrentList = currentItems.some(item => 
        item.name.toLowerCase() === suggestion.name && !item.isPurchased
      )
      return suggestion.frequency > 1 && !isInCurrentList && suggestion.daysSinceLastBought > 3
    })
    .sort((a, b) => {
      const scoreA = a.frequency * 10 - a.daysSinceLastBought * 0.1
      const scoreB = b.frequency * 10 - b.daysSinceLastBought * 0.1
      return scoreB - scoreA
    })
    .slice(0, 5)
}

export const checkExpiringItems = (pantry: ShoppingItem[]): ExpiringItem[] => {
  const now = new Date()
  const expiring: ExpiringItem[] = []

  pantry.forEach(item => {
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate)
      const daysUntilExpiry = calculations.daysUntil(expiryDate)
      
      if (daysUntilExpiry <= 3) {
        expiring.push({
          id: item.id,
          name: item.name,
          expiryDate,
          daysUntilExpiry
        })
      }
    }
  })

  return expiring
}

export const getItemsByCategory = (items: ShoppingItem[], categories: string[]) => {
  const itemsByCategory: Record<string, ShoppingItem[]> = {}
  
  categories.forEach(category => {
    itemsByCategory[category] = items.filter(item => item.category === category)
  })
  
  return itemsByCategory
}

/**
 * Enhanced helpers for statistics and common operations
 */

// Filter functions for shopping items
export const filterItemsByStatus = (items: ShoppingItem[]) => ({
  pending: items.filter(item => !item.isInCart && !item.isPurchased),
  inCart: items.filter(item => item.isInCart && !item.isPurchased),
  purchased: items.filter(item => item.isPurchased),
  expiring: items.filter(item => 
    item.expiryDate && 
    item.expiryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
  )
})

// Statistics calculation
export const calculateItemStats = (items: ShoppingItem[]) => {
  const filtered = filterItemsByStatus(items)
  const total = items.length
  
  return {
    total,
    pending: filtered.pending.length,
    inCart: filtered.inCart.length,
    purchased: filtered.purchased.length,
    expiring: filtered.expiring.length,
    completionRate: calculations.percentage(filtered.purchased.length, total),
    categoryStats: Object.entries(groupItemsByCategory(items)).reduce((stats, [category, categoryItems]) => {
      stats[category] = categoryItems.length
      return stats
    }, {} as Record<string, number>)
  }
}

// Bulk operation handler creator
export const createBulkOperationHandler = <T>(
  operation: (item: T) => Promise<boolean>,
  successMessage: (count: number) => string,
  errorMessage: string = 'שגיאה בביצוע הפעולה'
) => {
  return async (items: T[]) => {
    let successCount = 0
    let errorCount = 0

    for (const item of items) {
      try {
        const success = await operation(item)
        if (success) {
          successCount++
        } else {
          errorCount++
        }
      } catch {
        errorCount++
      }
    }

    return {
      success: errorCount === 0,
      data: successCount,
      count: successCount,
      message: errorCount === 0 ? successMessage(successCount) : 
        `${successMessage(successCount)}${errorCount > 0 ? ` (${errorCount} שגיאות)` : ''}`
    }
  }
}

// Group items by category
export const groupItemsByCategory = (items: ShoppingItem[]): Record<string, ShoppingItem[]> => {
  return items.reduce((grouped, item) => {
    const category = item.category || 'ללא קטגוריה'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
    return grouped
  }, {} as Record<string, ShoppingItem[]>)
}

// Sort items by priority (expiry date, then added date)
export const sortItemsByPriority = (items: ShoppingItem[]): ShoppingItem[] => {
  return [...items].sort((a, b) => {
    // First priority: items with expiry dates
    if (a.expiryDate && !b.expiryDate) return -1
    if (!a.expiryDate && b.expiryDate) return 1
    
    // If both have expiry dates, sort by expiry date
    if (a.expiryDate && b.expiryDate) {
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    }
    
    // Otherwise sort by creation date (newest first)
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  })
}
