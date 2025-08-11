import { useState, useMemo, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { CATEGORIES } from '../utils/constants'
import { Category, ShoppingItem } from '../types'
import { AutoComplete } from './AutoComplete'
import { CategorySelector } from './CategorySelector'
import { NotificationBanner } from './NotificationBanner'
import { generateSmartSuggestions, suggestCategoryForProduct } from '../utils/smartSuggestions'
import { useFormField } from '../hooks/useFormState'
import { validateProductName } from '../utils/validation'
import { getButtonClasses, containerStyles } from '../utils/classNames'

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
  const itemName = useFormField({
    initialValue: '',
    validator: (value: string) => {
      const result = validateProductName(value)
      return result.isValid ? undefined : result.error
    }
  })
  
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
    if (itemName.value.trim().length >= 2) {
      const suggested = suggestCategoryForProduct(itemName.value)
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
  }, [itemName.value, newItemCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (itemName.isValid && itemName.value.trim()) {
      onAddItem(itemName.value.trim(), newItemCategory)
      itemName.reset()
      setAutoChangedCategory(false)
    }
  }

  const handleAutoCompleteSelect = (selectedItem: string) => {
    onAddItem(selectedItem, newItemCategory)
    itemName.reset()
    setAutoChangedCategory(false)
  }

  const handleNameChange = (name: string) => {
    itemName.setValue(name)
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
    <div className={containerStyles.section}>
      <NotificationBanner
        type="auto-change"
        message=""
        category={newItemCategory}
        productName={itemName.value}
        isVisible={autoChangedCategory}
      />

      <NotificationBanner
        type="suggestion"
        message=""
        category={suggestedCategory || undefined}
        productName={itemName.value}
        onAccept={acceptCategorySuggestion}
        onDismiss={() => setShowCategorySuggestion(false)}
        isVisible={showCategorySuggestion && !!suggestedCategory}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <CategorySelector
              value={newItemCategory}
              onChange={setNewItemCategory}
              categories={CATEGORIES}
              isHighlighted={autoChangedCategory}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <AutoComplete
            value={itemName.value}
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
            className={getButtonClasses('primary', 'md', !itemName.isValid || !itemName.value.trim())}
            disabled={!itemName.isValid || !itemName.value.trim()}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
