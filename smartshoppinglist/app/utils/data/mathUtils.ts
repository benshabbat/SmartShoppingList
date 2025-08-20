/**
 * Mathematical utilities for statistics and calculations
 */

/**
 * Calculate percentage of a value relative to total
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Calculate average of an array of numbers
 */
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

/**
 * Find the most frequent item in an array
 */
export const getMostFrequent = <T>(items: T[]): T | null => {
  if (items.length === 0) return null
  
  const frequency: Record<string, { item: T; count: number }> = {}
  
  items.forEach(item => {
    const key = String(item)
    if (frequency[key]) {
      frequency[key].count++
    } else {
      frequency[key] = { item, count: 1 }
    }
  })
  
  return Object.values(frequency)
    .sort((a, b) => b.count - a.count)[0]?.item || null
}

/**
 * Group items by a key function
 */
export const groupBy = <T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return items.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

/**
 * Count occurrences of each item
 */
export const countOccurrences = <T>(items: T[]): Record<string, number> => {
  return items.reduce((counts, item) => {
    const key = String(item)
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {} as Record<string, number>)
}

/**
 * Get top N items by count
 */
export const getTopItems = <T>(
  items: T[],
  count: number = 5
): Array<{ item: T; count: number }> => {
  const counts = countOccurrences(items)
  
  return Object.entries(counts)
    .map(([key, count]) => ({
      item: items.find(item => String(item) === key)!,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, count)
}

/**
 * Calculate growth percentage between two values
 */
export const calculateGrowth = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return Math.round(((newValue - oldValue) / oldValue) * 100)
}

/**
 * Generate range of numbers
 */
export const range = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/**
 * Clamp a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}
