/**
 * Date and time utilities following DRY principles
 */

import { TIME_CONSTANTS } from '../constants'

/**
 * Format date in Hebrew locale
 */
export const formatDate = (date: Date | string | undefined | null) => {
  if (!date) return ''
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return ''
    }
    
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj)
  } catch (error) {
    console.warn('Failed to format date:', date, error)
    return ''
  }
}

/**
 * Get date N days ago from today
 */
export const getDaysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

/**
 * Get date N days from today
 */
export const getDaysFromNow = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

/**
 * Calculate days until expiry
 */
export const getDaysUntilExpiry = (expiryDate: string | Date | undefined | null): number => {
  if (!expiryDate) return 0
  
  try {
    const now = new Date()
    const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate)
    
    // Check if the date is valid
    if (isNaN(expiry.getTime())) {
      return 0
    }
    
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  } catch (error) {
    console.warn('Failed to calculate days until expiry:', expiryDate, error)
    return 0
  }
}

/**
 * Check if item is expiring within warning period
 */
export const isExpiringShortly = (expiryDate: string | Date | undefined | null): boolean => {
  if (!expiryDate) return false
  
  try {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate)
    return daysUntilExpiry <= TIME_CONSTANTS.EXPIRY_WARNING_DAYS && daysUntilExpiry >= 0
  } catch (error) {
    console.warn('Failed to check if expiring shortly:', expiryDate, error)
    return false
  }
}

/**
 * Check if date is within last N days
 */
export const isWithinLastDays = (date: string | Date | undefined | null, days: number): boolean => {
  if (!date) return false
  
  try {
    const targetDate = date instanceof Date ? date : new Date(date)
    
    // Check if the date is valid
    if (isNaN(targetDate.getTime())) {
      return false
    }
    
    const cutoffDate = getDaysAgo(days)
    return targetDate >= cutoffDate
  } catch (error) {
    console.warn('Failed to check if within last days:', date, error)
    return false
  }
}

/**
 * Get week number for date (useful for grouping)
 */
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
