import { ShoppingItem } from '../../types'
import { useAddItemFormLogic } from './useAddItemFormLogic'
import { AddItemFormUI } from './AddItemFormUI'

interface AddItemFormProps {
  purchaseHistory?: ShoppingItem[]
  currentItems?: ShoppingItem[]
}

/**
 * Container component that combines logic and UI
 * Follows the Container/Presentational pattern
 */
export const AddItemForm = ({ 
  purchaseHistory = [], 
  currentItems = [] 
}: AddItemFormProps) => {
  const logic = useAddItemFormLogic({
    purchaseHistory,
    currentItems
  })

  return (
    <AddItemFormUI
      itemName={logic.itemName}
      newItemCategory={logic.newItemCategory}
      suggestions={logic.suggestions}
      autoChangedCategory={logic.autoChangedCategory}
      showCategorySuggestion={logic.showCategorySuggestion}
      suggestedCategory={logic.suggestedCategory}
      isSubmitDisabled={logic.isSubmitDisabled}
      onSubmit={logic.handleSubmit}
      onAutoCompleteSelect={logic.handleAutoCompleteSelect}
      onNameChange={logic.handleNameChange}
      onCategorySuggestionAccept={logic.handleCategorySuggestionAccept}
      onCategorySuggestionDismiss={logic.handleCategorySuggestionDismiss}
      onCategoryChange={logic.setNewItemCategory}
      purchaseHistory={purchaseHistory}
    />
  )
}
