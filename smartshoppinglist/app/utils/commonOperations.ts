/**
 * Common shopping operations to avoid repetition
 */

import type { ShoppingItem } from '../types'

/**
 * Common item filtering operations
 */
export const itemFilters = {
  inCart: (items: ShoppingItem[]) => items.filter(item => item.isInCart),
  purchased: (items: ShoppingItem[]) => items.filter(item => item.isPurchased),
  pending: (items: ShoppingItem[]) => items.filter(item => !item.isInCart && !item.isPurchased),
  byCategory: (items: ShoppingItem[], category: string) => 
    items.filter(item => item.category === category),
  expiring: (items: ShoppingItem[], daysThreshold = 3) => {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() + daysThreshold)
    return items.filter(item => 
      item.expiryDate && 
      item.expiryDate <= threshold && 
      item.expiryDate > new Date()
    )
  }
}

/**
 * Common item transformations
 */
export const itemTransforms = {
  toCart: (item: ShoppingItem): Partial<ShoppingItem> => ({
    isInCart: true
  }),
  
  toPurchased: (item: ShoppingItem): Partial<ShoppingItem> => ({
    isPurchased: true,
    purchasedAt: new Date()
  }),
  
  toPending: (item: ShoppingItem): Partial<ShoppingItem> => ({
    isInCart: false,
    isPurchased: false
  })
}

/**
 * Common statistics calculations
 */
export const itemStats = {
  completionRate: (items: ShoppingItem[]): number => {
    if (items.length === 0) return 0
    const purchasedCount = itemFilters.purchased(items).length
    return Math.round((purchasedCount / items.length) * 100)
  },

  categoryStats: (items: ShoppingItem[]): Record<string, number> => {
    const stats: Record<string, number> = {}
    items.forEach(item => {
      stats[item.category] = (stats[item.category] || 0) + 1
    })
    return stats
  },

  dailyStats: (items: ShoppingItem[]): Record<string, number> => {
    const stats: Record<string, number> = {}
    items.forEach(item => {
      if (item.addedAt) {
        const date = item.addedAt.toDateString()
        stats[date] = (stats[date] || 0) + 1
      }
    })
    return stats
  }
}

/**
 * Common bulk operations
 */
export const bulkOperations = {
  /**
   * Applies the same update to multiple items
   */
  updateMultiple: async <T>(
    items: T[],
    updateFn: (item: T) => Promise<void>,
    onProgress?: (completed: number, total: number) => void
  ): Promise<{ success: number; failed: number }> => {
    let success = 0
    let failed = 0

    for (let i = 0; i < items.length; i++) {
      try {
        await updateFn(items[i])
        success++
      } catch {
        failed++
      }
      
      if (onProgress) {
        onProgress(i + 1, items.length)
      }
    }

    return { success, failed }
  },

  /**
   * Checks for duplicates before adding items
   */
  addWithDuplicateCheck: <T>(
    existingItems: T[],
    newItems: T[],
    keyFn: (item: T) => string
  ): { toAdd: T[]; duplicates: T[] } => {
    const existingKeys = new Set(existingItems.map(keyFn))
    const toAdd: T[] = []
    const duplicates: T[] = []

    newItems.forEach(item => {
      if (existingKeys.has(keyFn(item))) {
        duplicates.push(item)
      } else {
        toAdd.push(item)
      }
    })

    return { toAdd, duplicates }
  }
}

/**
 * Common message formatters
 */
export const messageFormatters = {
  bulkSuccess: (successCount: number, operation: string, duplicateCount = 0): string => {
    let message = `${operation} ${successCount} פריטים`
    if (duplicateCount > 0) {
      message += ` (${duplicateCount} פריטים כבר קיימים)`
    }
    return message
  },

  bulkPartialSuccess: (success: number, failed: number, operation: string): string => {
    return `${operation} ${success} פריטים בהצלחה, ${failed} נכשלו`
  }
}
