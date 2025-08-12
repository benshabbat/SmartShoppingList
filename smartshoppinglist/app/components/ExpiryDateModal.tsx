'use client'

import { useState } from 'react'
import { ShoppingItem } from '../types'
import { Card } from './Card'

interface ExpiryDateModalProps {
  items: ShoppingItem[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
}

export function ExpiryDateModal({ items, isOpen, onClose, onSubmit }: ExpiryDateModalProps) {
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({})
  const [skippedItems, setSkippedItems] = useState<Set<string>>(new Set())

  if (!isOpen) return null

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
    setExpiryDates({})
    setSkippedItems(new Set())
    onClose()
  }

  const handleSkip = () => {
    const itemsWithoutExpiry = items.map(item => ({
      id: item.id,
      expiryDate: undefined
    }))
    
    onSubmit(itemsWithoutExpiry)
    setExpiryDates({})
    setSkippedItems(new Set())
    onClose()
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  
  // Quick date options
  const getQuickDate = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  const quickDateOptions = [
    { label: 'מחר', days: 1 },
    { label: 'בעוד 3 ימים', days: 3 },
    { label: 'בעוד שבוע', days: 7 },
    { label: 'בעוד חודש', days: 30 }
  ]

  const setQuickDate = (itemId: string, days: number) => {
    handleExpiryDateChange(itemId, getQuickDate(days))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              📅 תאריכי פג תוקף
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            האם תרצה להוסיף תאריכי פג תוקף למוצרים שקנית? זה יעזור לך לעקוב אחר המוצרים במטבח ולקבל התראות כשמוצרים מתקרבים לפג תוקף.
          </p>

          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.id} className={`p-4 rounded-lg border-2 transition-all ${
                skippedItems.has(item.id) 
                  ? 'bg-gray-100 border-gray-300 opacity-60' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛒</span>
                    <span className={`font-medium ${skippedItems.has(item.id) ? 'text-gray-500' : 'text-gray-800'}`}>
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSkipItem(item.id)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        skippedItems.has(item.id)
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {skippedItems.has(item.id) ? '✓ לא רלוונטי' : 'לא רלוונטי'}
                    </button>
                    
                    {!skippedItems.has(item.id) && (
                      <div className="flex flex-col gap-2">
                        <input
                          type="date"
                          min={today}
                          value={expiryDates[item.id] || ''}
                          onChange={(e) => handleExpiryDateChange(item.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="תאריך פג תוקף"
                        />
                        <div className="flex gap-1">
                          {quickDateOptions.map((option) => (
                            <button
                              key={option.days}
                              type="button"
                              onClick={() => setQuickDate(item.id, option.days)}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {skippedItems.has(item.id) && (
                  <p className="text-xs text-gray-500 mt-2 mr-8">
                    מוצר זה לא יתווסף למעקב פג תוקף
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              דלג על הכל
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <span>סיים רכישה</span>
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                {items.filter(item => expiryDates[item.id] && !skippedItems.has(item.id)).length} עם תאריך
              </span>
              ✅
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
