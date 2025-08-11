// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, X, ShoppingCart, History, Lightbulb, Calendar, AlertTriangle, Clock } from 'lucide-react'

interface ShoppingItem {
  id: string
  name: string
  category?: string
  isCompleted: boolean
  addedAt: Date
  completedAt?: Date
  expiryDate?: Date
}

interface ItemSuggestion {
  name: string
  frequency: number
  lastBought: Date
  daysSinceLastBought: number
}

interface ExpiringItem {
  name: string
  expiryDate: Date
  daysUntilExpiry: number
}

interface PurchasedItem {
  id: string
  name: string
}

export default function ShoppingListApp() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemExpiry, setNewItemExpiry] = useState('')
  const [showExpiryInput, setShowExpiryInput] = useState(false)
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([])
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([])
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [showPurchaseExpiryModal, setShowPurchaseExpiryModal] = useState(false)
  const [purchasedItemForExpiry, setPurchasedItemForExpiry] = useState<PurchasedItem | null>(null)
  const [purchaseExpiryDate, setPurchaseExpiryDate] = useState('')
  const [purchaseHistory, setPurchaseHistory] = useState<ShoppingItem[]>([])
  const [pantryItems, setPantryItems] = useState<ShoppingItem[]>([])
  const [lastVisit, setLastVisit] = useState<Date | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingList')
    const savedHistory = localStorage.getItem('purchaseHistory')
    const savedPantry = localStorage.getItem('pantryItems')
    const savedLastVisit = localStorage.getItem('lastVisit')
    
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
    
    if (savedHistory) {
      const history = JSON.parse(savedHistory)
      setPurchaseHistory(history)
      generateSuggestions(history)
    }

    if (savedPantry) {
      const pantry = JSON.parse(savedPantry)
      setPantryItems(pantry)
      checkExpiringItems(pantry)
    }

    if (savedLastVisit) {
      setLastVisit(new Date(savedLastVisit))
      // Check if it's been more than a day since last visit
      const daysSinceVisit = Math.floor((Date.now() - new Date(savedLastVisit).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceVisit >= 1) {
        setTimeout(() => checkExpiringItems(JSON.parse(savedPantry || '[]')), 1000)
      }
    }

    // Update last visit
    localStorage.setItem('lastVisit', new Date().toISOString())
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems))
  }, [pantryItems])

  // Check for expiring items
  const checkExpiringItems = (pantry: ShoppingItem[]) => {
    const now = new Date()
    const expiring: ExpiringItem[] = []

    pantry.forEach(item => {
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        // Show items that expire within 3 days or already expired
        if (daysUntilExpiry <= 3) {
          expiring.push({
            name: item.name,
            expiryDate,
            daysUntilExpiry
          })
        }
      }
    })

    setExpiringItems(expiring)
    if (expiring.length > 0) {
      setShowExpiryModal(true)
    }
  }

  // Generate smart suggestions based on purchase history
  const generateSuggestions = (history: ShoppingItem[]) => {
    const itemFrequency: Record<string, { count: number; lastBought: Date }> = {}
    
    history.forEach(item => {
      const itemName = item.name.toLowerCase()
      if (itemFrequency[itemName]) {
        itemFrequency[itemName].count++
        if (new Date(item.completedAt!) > itemFrequency[itemName].lastBought) {
          itemFrequency[itemName].lastBought = new Date(item.completedAt!)
        }
      } else {
        itemFrequency[itemName] = {
          count: 1,
          lastBought: new Date(item.completedAt!)
        }
      }
    })

    const now = new Date()
    const suggestions: ItemSuggestion[] = Object.entries(itemFrequency)
      .map(([name, data]) => {
        const daysSince = Math.floor((now.getTime() - data.lastBought.getTime()) / (1000 * 60 * 60 * 24))
        return {
          name,
          frequency: data.count,
          lastBought: data.lastBought,
          daysSinceLastBought: daysSince
        }
      })
      .filter(suggestion => {
        const isInCurrentList = items.some(item => 
          item.name.toLowerCase() === suggestion.name && !item.isCompleted
        )
        return suggestion.frequency > 1 && !isInCurrentList && suggestion.daysSinceLastBought > 3
      })
      .sort((a, b) => {
        const scoreA = a.frequency * 10 - a.daysSinceLastBought * 0.1
        const scoreB = b.frequency * 10 - b.daysSinceLastBought * 0.1
        return scoreB - scoreA
      })
      .slice(0, 5)

    setSuggestions(suggestions)
  }

  const addItem = (itemName: string, expiryDate?: string) => {
    if (!itemName.trim()) return
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      isCompleted: false,
      addedAt: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined
    }
    
    setItems(prev => [...prev, newItem])
    setNewItemName('')
    setNewItemExpiry('')
    setShowExpiryInput(false)
  }

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          isCompleted: !item.isCompleted,
          completedAt: !item.isCompleted ? new Date() : undefined
        }
        
        // If completing item, add to purchase history and pantry
        if (!item.isCompleted) {
          const newHistory = [...purchaseHistory, updatedItem]
          setPurchaseHistory(newHistory)
          localStorage.setItem('purchaseHistory', JSON.stringify(newHistory))
          generateSuggestions(newHistory)

          // Add to pantry if it has expiry date
          if (updatedItem.expiryDate) {
            const newPantry = [...pantryItems, updatedItem]
            setPantryItems(newPantry)
          }
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const addSuggestedItem = (suggestionName: string) => {
    addItem(suggestionName)
    setSuggestions(prev => prev.filter(s => s.name !== suggestionName.toLowerCase()))
  }

  const addExpiringItemToList = (itemName: string) => {
    addItem(itemName)
    setExpiringItems(prev => prev.filter(item => item.name !== itemName))
  }

  const removeFromPantry = (itemName: string) => {
    setPantryItems(prev => prev.filter(item => item.name !== itemName))
    setExpiringItems(prev => prev.filter(item => item.name !== itemName))
  }

  const clearCompleted = () => {
    setItems(prev => prev.filter(item => !item.isCompleted))
  }

  const getItemsByStatus = () => {
    const pending = items.filter(item => !item.isCompleted)
    const completed = items.filter(item => item.isCompleted)
    return { pending, completed }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const getExpiryColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'text-red-600 bg-red-50'
    if (daysUntilExpiry <= 1) return 'text-orange-600 bg-orange-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  const { pending, completed } = getItemsByStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">רשימת קניות חכמה</h1>
          </div>
          <p className="text-gray-600">עם מעקב תוקף ותזכורות</p>
        </div>

        {/* Expiry Modal */}
        {showExpiryModal && expiringItems.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-bold text-gray-800">מוצרים שעומדים לפוג</h3>
              </div>
              <p className="text-gray-600 mb-4">נמצאו מוצרים שעומדים לפוג או פגו. האם תרצה להוסיף משהו לרשימה?</p>
              
              <div className="space-y-3 mb-6">
                {expiringItems.map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getExpiryColor(item.daysUntilExpiry)}`}>
                    <div className="flex justify-between items-center">
                      <div className="text-right">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm">
                          {item.daysUntilExpiry < 0 
                            ? `פג לפני ${Math.abs(item.daysUntilExpiry)} ימים`
                            : item.daysUntilExpiry === 0 
                            ? 'פג היום!'
                            : `פג בעוד ${item.daysUntilExpiry} ימים`
                          }
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addExpiringItemToList(item.name)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          הוסף לרשימה
                        </button>
                        <button
                          onClick={() => removeFromPantry(item.name)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          הושלך
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowExpiryModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                סגור
              </button>
            </div>
          </div>
        )}

        {/* Add new item */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showExpiryInput && addItem(newItemName)}
                placeholder="הוסף מוצר חדש..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                dir="rtl"
              />
              <button
                onClick={() => setShowExpiryInput(!showExpiryInput)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  showExpiryInput ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={() => addItem(newItemName, newItemExpiry)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {showExpiryInput && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={newItemExpiry}
                  onChange={(e) => setNewItemExpiry(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem(newItemName, newItemExpiry)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">תאריך תפוגה</span>
              </div>
            )}
          </div>
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-4 mb-6 border border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-800">הצעות חכמות</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2">
                  <div className="text-right">
                    <span className="font-medium">{suggestion.name}</span>
                    <div className="text-xs text-gray-500">
                      נקנה {suggestion.frequency} פעמים • לפני {suggestion.daysSinceLastBought} ימים
                    </div>
                  </div>
                  <button
                    onClick={() => addSuggestedItem(suggestion.name)}
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
                  >
                    הוסף
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expiring Items Alert */}
        {expiringItems.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-md p-4 mb-6 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-800">מוצרים שעומדים לפוג</h3>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              יש לך {expiringItems.length} מוצרים שעומדים לפוג בקרוב
            </div>
            <button
              onClick={() => setShowExpiryModal(true)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
            >
              הצג פרטים
            </button>
          </div>
        )}

        {/* Pending Items */}
        {pending.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-right">לקנות</h3>
            <div className="space-y-2">
              {pending.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-green-500 transition-colors flex items-center justify-center"
                  >
                    {item.isCompleted && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                  <div className="flex-1 text-right">
                    <div className="font-medium">{item.name}</div>
                    {item.expiryDate && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                        <span>תוקף עד: {formatDate(item.expiryDate)}</span>
                        <Calendar className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Items */}
        {completed.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={clearCompleted}
                className="text-sm text-red-600 hover:text-red-800"
              >
                נקה הכל
              </button>
              <h3 className="font-semibold text-gray-800 text-right">נקנה ✓</h3>
            </div>
            <div className="space-y-2">
              {completed.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 border-2 border-green-500 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex-1 text-right">
                    <div className="line-through text-gray-600 font-medium">{item.name}</div>
                    {item.expiryDate && (
                      <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <span>תוקף עד: {formatDate(item.expiryDate)}</span>
                        <Calendar className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">סטטיסטיקות</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-indigo-50 rounded-lg p-3">
              <div className="text-lg font-bold text-indigo-600">{purchaseHistory.length}</div>
              <div className="text-xs text-gray-600">מוצרים נקנו</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-lg font-bold text-green-600">{suggestions.length}</div>
              <div className="text-xs text-gray-600">הצעות חכמות</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">{pantryItems.length}</div>
              <div className="text-xs text-gray-600">במזווה</div>
            </div>
          </div>
        </div>

        {items.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>הרשימה ריקה. התחל להוסיף מוצרים!</p>
          </div>
        )}
      </div>
    </div>
  )
}