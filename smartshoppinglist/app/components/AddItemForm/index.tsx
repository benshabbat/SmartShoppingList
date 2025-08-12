import { useAddItemFormLogic } from './useAddItemFormLogic'
import { AddItemFormUI } from './AddItemFormUI'

/**
 * Container component that combines logic and UI
 * NO PROPS DRILLING - everything comes from global context!
 */
export const AddItemForm = () => {
  // No props needed - everything from global context!
  const logic = useAddItemFormLogic()

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
