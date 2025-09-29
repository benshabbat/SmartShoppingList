/**
 * Date and time formatting utilities
 */

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'תאריך לא תקין'
  }

  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

  // If today
  if (diffDays === 0) {
    return `היום בשעה ${dateObj.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  // If yesterday
  if (diffDays === 1) {
    return `אתמול בשעה ${dateObj.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  // If within the last week
  if (diffDays < 7) {
    const dayName = dateObj.toLocaleDateString('he-IL', { weekday: 'long' })
    return `ב${dayName}`
  }
  
  // If within the last month
  if (diffDays < 30) {
    return `לפני ${diffDays} ימים`
  }
  
  // Otherwise, show full date
  return dateObj.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'שעה לא תקינה'
  }

  return dateObj.toLocaleTimeString('he-IL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'תאריך ושעה לא תקינים'
  }

  return dateObj.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'זמן לא תקין'
  }

  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  const diffMinutes = Math.floor(diff / (1000 * 60))
  const diffHours = Math.floor(diff / (1000 * 60 * 60))
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return 'עכשיו'
  }
  
  if (diffMinutes < 60) {
    return `לפני ${diffMinutes} דקות`
  }
  
  if (diffHours < 24) {
    return `לפני ${diffHours} שעות`
  }
  
  return `לפני ${diffDays} ימים`
}

export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear()
}

export const isYesterday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return dateObj.getDate() === yesterday.getDate() &&
         dateObj.getMonth() === yesterday.getMonth() &&
         dateObj.getFullYear() === yesterday.getFullYear()
}

export const isThisWeek = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  return dateObj >= weekStart && dateObj < weekEnd
}