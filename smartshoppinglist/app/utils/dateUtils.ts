/**
 * Date and time utilities following DRY principles
 */

import { TIME_CONSTANTS } from './appConstants'

/**
 * Format date in Hebrew locale
 */
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
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
export const getDaysUntilExpiry = (expiryDate: string | Date): number => {
  const now = new Date()
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Check if item is expiring within warning period
 */
export const isExpiringShortly = (expiryDate: string | Date): boolean => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate)
  return daysUntilExpiry <= TIME_CONSTANTS.EXPIRY_WARNING_DAYS && daysUntilExpiry >= 0
}

/**
 * Check if date is within last N days
 */
export const isWithinLastDays = (date: string | Date, days: number): boolean => {
  const targetDate = new Date(date)
  const cutoffDate = getDaysAgo(days)
  return targetDate >= cutoffDate
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
