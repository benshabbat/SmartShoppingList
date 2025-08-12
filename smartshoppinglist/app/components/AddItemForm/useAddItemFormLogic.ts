import { useState, useMemo, useEffect } from 'react'
import { Category, ShoppingItem } from '../../types'
import { generateSmartSuggestions, suggestCategoryForProduct } from '../../utils/smartSuggestions'
import { useFormField } from '../../hooks/useFormState'
import { validateProductName } from '../../utils/validation'
import { useAddShoppingItem } from '../../hooks/useShoppingItems'

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
  const addItemMutation = useAddShoppingItem()
  
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
    return generateSmartSuggestions(newItemCategory, purchaseHistory, currentItems)
  }, [newItemCategory, purchaseHistory, currentItems])

  // Auto-suggest category based on product name
  useEffect(() => {
    if (itemName.value.trim().length >= 2) {
      const suggested = suggestCategoryForProduct(itemName.value)
      if (suggested !== newItemCategory && suggested !== 'אחר') {
        setNewItemCategory(suggested as Category)
        setAutoChangedCategory(true)
        setShowCategorySuggestion(false)
        
        // Hide notification after 3 seconds
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

  // Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (itemName.isValid && itemName.value.trim()) {
      addItemMutation.mutate({
        name: itemName.value.trim(),
        category: newItemCategory,
        isInCart: false,
        isPurchased: false,
      })
      itemName.reset()
      setAutoChangedCategory(false)
    }
  }

  const handleAutoCompleteSelect = (selectedItem: string) => {
    addItemMutation.mutate({
      name: selectedItem,
      category: newItemCategory,
      isInCart: false,
      isPurchased: false,
    })
    itemName.reset()
    setAutoChangedCategory(false)
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
  const isSubmitDisabled = !itemName.isValid || !itemName.value.trim() || addItemMutation.isPending

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
    
    // Mutation state
    isLoading: addItemMutation.isPending,
    
    // Event handlers
    handleSubmit,
    handleAutoCompleteSelect,
    handleNameChange,
    handleCategorySuggestionAccept,
    handleCategorySuggestionDismiss,
    setNewItemCategory,
  }
}
