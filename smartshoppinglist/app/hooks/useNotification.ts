import { useState, useCallback } from 'react'

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([])

  const addNotification = useCallback((
    notification: Omit<NotificationState, 'id'>
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, notification.duration || 3000)
    }
    
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Convenience methods
  const success = useCallback((message: string, duration?: number) => 
    addNotification({ type: 'success', message, duration }), [addNotification])
  
  const error = useCallback((message: string, duration?: number) => 
    addNotification({ type: 'error', message, duration }), [addNotification])
  
  const warning = useCallback((message: string, duration?: number) => 
    addNotification({ type: 'warning', message, duration }), [addNotification])
  
  const info = useCallback((message: string, duration?: number) => 
    addNotification({ type: 'info', message, duration }), [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
