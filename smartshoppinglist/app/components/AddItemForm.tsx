import { useState, useMemo, useEffect } from 'react'
import { Plus, Lightbulb } from 'lucide-react'
import { CATEGORIES, CATEGORY_EMOJIS } from '../utils/constants'
import { Category, ShoppingItem } from '../types'
import { AutoComplete } from './AutoComplete'
import { generateSmartSuggestions, suggestCategoryForProduct } from '../utils/smartSuggestions'

interface AddItemFormProps {
  onAddItem: (name: string, category: string) => void
  purchaseHistory?: ShoppingItem[]
  currentItems?: ShoppingItem[]
}

export const AddItemForm = ({ 
  onAddItem, 
  purchaseHistory = [], 
  currentItems = [] 
}: AddItemFormProps) => {
  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState<Category>('פירות וירקות')
  const [showCategorySuggestion, setShowCategorySuggestion] = useState(false)
  const [suggestedCategory, setSuggestedCategory] = useState<Category | null>(null)
  const [autoChangedCategory, setAutoChangedCategory] = useState(false)

  // יצירת רשימת הצעות חכמות
  const suggestions = useMemo(() => {
    return generateSmartSuggestions(newItemCategory, purchaseHistory, currentItems)
  }, [newItemCategory, purchaseHistory, currentItems])

  // זיהוי קטגוריה מתאימה למוצר שהוזן עם החלפה אוטומטית
  useEffect(() => {
    if (newItemName.trim().length >= 2) {
      const suggested = suggestCategoryForProduct(newItemName)
      if (suggested !== newItemCategory && suggested !== 'אחר') {
        // החלף אוטומטית את הקטגוריה
        setNewItemCategory(suggested as Category)
        setAutoChangedCategory(true)
        setShowCategorySuggestion(false)
        
        // הסתר את ההודעה אחרי 3 שניות
        setTimeout(() => {
          setAutoChangedCategory(false)
        }, 3000)
      } else {
        setShowCategorySuggestion(false)
        setAutoChangedCategory(false)
      }
    } else {
      setShowCategorySuggestion(false)
      setAutoChangedCategory(false)
    }
  }, [newItemName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemName.trim()) {
      onAddItem(newItemName.trim(), newItemCategory)
      setNewItemName('')
      setAutoChangedCategory(false)
    }
  }

  const handleAutoCompleteSelect = (selectedItem: string) => {
    onAddItem(selectedItem, newItemCategory)
    setNewItemName('')
    setAutoChangedCategory(false)
  }

  const handleNameChange = (name: string) => {
    setNewItemName(name)
    // אם השם התחיל להשתנות, החבא את ההודעה על שינוי אוטומטי
    if (autoChangedCategory && name.length < 2) {
      setAutoChangedCategory(false)
    }
  }

  const acceptCategorySuggestion = () => {
    if (suggestedCategory) {
      setNewItemCategory(suggestedCategory)
      setShowCategorySuggestion(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      {/* הודעה על שינוי אוטומטי של הקטגוריה */}
      {autoChangedCategory && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-right">
              <span className="text-sm text-green-700">
                הקטגוריה שונתה אוטומטית ל
                <span className="font-semibold text-green-800 mr-1">
                  {CATEGORY_EMOJIS[newItemCategory]} {newItemCategory}
                </span>
                עבור &quot;{newItemName}&quot;
              </span>
              <Lightbulb className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* הצעת קטגוריה חכמה */}
      {showCategorySuggestion && suggestedCategory && (
        <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={acceptCategorySuggestion}
                className="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors"
              >
                החלף
              </button>
              <button
                onClick={() => setShowCategorySuggestion(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                התעלם
              </button>
            </div>
            <div className="flex items-center gap-2 text-right">
              <span className="text-sm text-gray-600">
                אולי &quot;{newItemName}&quot; שייך ל
                <span className="font-semibold text-amber-700">
                  {CATEGORY_EMOJIS[suggestedCategory]} {suggestedCategory}
                </span>
                ?
              </span>
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              קטגוריה
            </label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as Category)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all duration-300 ${
                autoChangedCategory ? 'ring-2 ring-green-400 border-green-300 bg-green-50' : ''
              }`}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {CATEGORY_EMOJIS[category]} {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <AutoComplete
            value={newItemName}
            onChange={handleNameChange}
            onSelect={handleAutoCompleteSelect}
            suggestions={suggestions}
            purchaseHistory={purchaseHistory}
            placeholder={`הוסף ${newItemCategory}...`}
            className="flex-1"
            autoChangedCategory={autoChangedCategory}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!newItemName.trim()}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
