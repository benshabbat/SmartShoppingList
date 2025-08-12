import { useState, useMemo, useEffect } from 'react'
import { Category, ShoppingItem } from '../../types'
import { generateSmartSuggestions, suggestCategoryForProduct } from '../../utils/smartSuggestions'
import { useFormField } from '../../hooks/useFormState'
import { validateProductName } from '../../utils/validation'
import { useShoppingListContext } from '../../providers'

interface UseAddItemFormLogicProps {
  purchaseHistory: ShoppingItem[]
  currentItems: ShoppingItem[]
}

/**
 * Custom hook for AddItemForm business logic
 * Handles form state, validation, suggestions, and mutations
 */
export const useAddItemFormLogic = ({ 
  purchaseHistory, 
  currentItems 
}: UseAddItemFormLogicProps) => {
  const { addItem, showSuccess, showError } = useShoppingListContext()
  
  // Form field with validation
  const itemName = useFormField({
    initialValue: '',
    validator: (value: string) => {
      const result = validateProductName(value)
      return result.isValid ? undefined : result.error
    }
  })
  
  // State management
  const [newItemCategory, setNewItemCategory] = useState<Category>('פירות וירקות')
  const [showCategorySuggestion, setShowCategorySuggestion] = useState(false)
  const [suggestedCategory] = useState<Category | null>(null)
  const [autoChangedCategory, setAutoChangedCategory] = useState(false)

  // Smart suggestions based on category and history
  const suggestions = useMemo(() => {
    const generated = generateSmartSuggestions(newItemCategory, purchaseHistory, currentItems)
    console.log('🔮 Generated suggestions for category', newItemCategory, ':', generated)
    return generated
  }, [newItemCategory, purchaseHistory, currentItems])

  // Auto-suggest category based on product name
  useEffect(() => {
    if (itemName.value.trim().length >= 2) {
      const suggested = suggestCategoryForProduct(itemName.value)
      console.log('🔍 Suggested category for', itemName.value, ':', suggested)
      
      if (suggested && suggested !== newItemCategory && suggested !== 'אחר') {
        console.log('✅ Changing category from', newItemCategory, 'to', suggested)
        setNewItemCategory(suggested as Category)
        setAutoChangedCategory(true)
        setShowCategorySuggestion(false)
        
        // Hide notification after 4 seconds
        setTimeout(() => {
          setAutoChangedCategory(false)
        }, 4000)
      }
    } else {
      // Reset auto-change state when text is too short
      if (autoChangedCategory) {
        setAutoChangedCategory(false)
      }
    }
  }, [itemName.value, newItemCategory, autoChangedCategory])

  // Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (itemName.isValid && itemName.value.trim()) {
      try {
        await addItem(itemName.value.trim(), newItemCategory)
        showSuccess(`${itemName.value.trim()} נוסף לרשימה`)
        itemName.reset()
        setAutoChangedCategory(false)
      } catch (error) {
        showError('שגיאה בהוספת הפריט')
      }
    }
  }

  const handleAutoCompleteSelect = async (selectedItem: string) => {
    try {
      await addItem(selectedItem, newItemCategory)
      showSuccess(`${selectedItem} נוסף לרשימה`)
      itemName.reset()
      setAutoChangedCategory(false)
    } catch (error) {
      showError('שגיאה בהוספת הפריט')
    }
  }

  const handleNameChange = (name: string) => {
    itemName.setValue(name)
    // Hide auto-change notification if name becomes too short
    if (autoChangedCategory && name.length < 2) {
      setAutoChangedCategory(false)
    }
  }

  const handleCategorySuggestionAccept = () => {
    if (suggestedCategory) {
      setNewItemCategory(suggestedCategory)
      setShowCategorySuggestion(false)
    }
  }

  const handleCategorySuggestionDismiss = () => {
    setShowCategorySuggestion(false)
  }

  // Computed values
  const isSubmitDisabled = !itemName.isValid || !itemName.value.trim()

  return {
    // Form data
    itemName,
    newItemCategory,
    suggestions,
    
    // UI state
    autoChangedCategory,
    showCategorySuggestion,
    suggestedCategory,
    isSubmitDisabled,
    
    // Event handlers
    handleSubmit,
    handleAutoCompleteSelect,
    handleNameChange,
    handleCategorySuggestionAccept,
    handleCategorySuggestionDismiss,
    setNewItemCategory,
  }
}
