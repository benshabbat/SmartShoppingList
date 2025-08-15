import { useState } from 'react'
import { UseExpiryDateModalLogicProps } from '../../types'

/**
 * Custom hook for ExpiryDateModal business logic
 * Handles form state, date management, and item operations
 */
export const useExpiryDateModalLogic = ({ 
  items, 
  onSubmit, 
  onClose 
}: UseExpiryDateModalLogicProps) => {
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({})
  const [skippedItems, setSkippedItems] = useState<Set<string>>(new Set())

  // Event handlers
  const handleExpiryDateChange = (itemId: string, date: string) => {
    setExpiryDates(prev => ({
      ...prev,
      [itemId]: date
    }))
  }

  const handleSkipItem = (itemId: string) => {
    const newSkipped = new Set(skippedItems)
    if (skippedItems.has(itemId)) {
      newSkipped.delete(itemId)
    } else {
      newSkipped.add(itemId)
      // Remove expiry date if item is skipped
      const newDates = { ...expiryDates }
      delete newDates[itemId]
      setExpiryDates(newDates)
    }
    setSkippedItems(newSkipped)
  }

  const handleSubmit = () => {
    const itemsWithExpiry = items.map(item => ({
      id: item.id,
      expiryDate: skippedItems.has(item.id) ? undefined : 
                  expiryDates[item.id] ? new Date(expiryDates[item.id]) : undefined
    }))
    
    onSubmit(itemsWithExpiry)
    resetForm()
    onClose?.()
  }

  const handleSkip = () => {
    const itemsWithoutExpiry = items.map(item => ({
      id: item.id,
      expiryDate: undefined
    }))
    
    onSubmit(itemsWithoutExpiry)
    resetForm()
    onClose?.()
  }

  const handleQuickDateSet = (itemId: string, days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    const dateString = date.toISOString().split('T')[0]
    handleExpiryDateChange(itemId, dateString)
  }

  const handleSetAllDates = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    const dateString = date.toISOString().split('T')[0]
    
    const newDates: Record<string, string> = {}
    items.forEach(item => {
      if (!skippedItems.has(item.id)) {
        newDates[item.id] = dateString
      }
    })
    setExpiryDates(prev => ({ ...prev, ...newDates }))
  }

  const resetForm = () => {
    setExpiryDates({})
    setSkippedItems(new Set())
  }

  // Computed values
  const today = new Date().toISOString().split('T')[0]
  
  const getQuickDate = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  const quickDateOptions = [
    { label: 'מחר', value: getQuickDate(1), days: 1 },
    { label: 'בעוד 3 ימים', value: getQuickDate(3), days: 3 },
    { label: 'בעוד שבוע', value: getQuickDate(7), days: 7 },
    { label: 'בעוד חודש', value: getQuickDate(30), days: 30 }
  ]

  const hasAnyDates = Object.keys(expiryDates).length > 0
  const allItemsProcessed = items.every(item => 
    skippedItems.has(item.id) || expiryDates[item.id]
  )

  return {
    // State
    expiryDates,
    skippedItems,
    
    // Computed values
    today,
    quickDateOptions,
    hasAnyDates,
    allItemsProcessed,
    
    // Event handlers
    handleExpiryDateChange,
    handleSkipItem,
    handleSubmit,
    handleSkip,
    handleQuickDateSet,
    handleSetAllDates,
    resetForm,
    getQuickDate,
  }
}
