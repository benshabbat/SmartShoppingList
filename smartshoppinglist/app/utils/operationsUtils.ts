/**
 * Common operations utilities for shopping items
 */

import { ShoppingItem } from '../types'

export interface OperationResult<T = unknown> {
  success: boolean
  data?: T
  message?: string
  count?: number
}

export const createBulkOperationHandler = <T>(
  operation: (item: T) => Promise<boolean>,
  successMessage: (count: number) => string,
  errorMessage: string = 'שגיאה בביצוע הפעולה'
) => {
  return async (items: T[]): Promise<OperationResult<number>> => {
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

export const filterItemsByStatus = (items: ShoppingItem[]) => ({
  pending: items.filter(item => !item.isInCart && !item.isPurchased),
  inCart: items.filter(item => item.isInCart && !item.isPurchased),
  purchased: items.filter(item => item.isPurchased),
  expiring: items.filter(item => 
    item.expiryDate && 
    item.expiryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
  )
})

export const groupItemsByCategory = (items: ShoppingItem[]): Record<string, ShoppingItem[]> => {
  return items.reduce((groups, item) => {
    const category = item.category || 'כלל'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {} as Record<string, ShoppingItem[]>)
}

export const sortItemsByPriority = (items: ShoppingItem[]): ShoppingItem[] => {
  return [...items].sort((a, b) => {
    // First by expiry date (sooner expiry = higher priority)
    if (a.expiryDate && b.expiryDate) {
      return a.expiryDate.getTime() - b.expiryDate.getTime()
    }
    if (a.expiryDate && !b.expiryDate) return -1
    if (!a.expiryDate && b.expiryDate) return 1
    
    // Then by added date (newer = higher priority)
    return b.addedAt.getTime() - a.addedAt.getTime()
  })
}

export const calculateItemStats = (items: ShoppingItem[]) => {
  const filtered = filterItemsByStatus(items)
  const total = items.length
  
  return {
    total,
    pending: filtered.pending.length,
    inCart: filtered.inCart.length,
    purchased: filtered.purchased.length,
    expiring: filtered.expiring.length,
    completionRate: total > 0 ? Math.round((filtered.purchased.length / total) * 100) : 0,
    categoryStats: Object.entries(groupItemsByCategory(items)).reduce((stats, [category, categoryItems]) => {
      stats[category] = categoryItems.length
      return stats
    }, {} as Record<string, number>)
  }
}
