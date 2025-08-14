import { useAddItemFormLogic } from './AddItemForm/useAddItemFormLogic'
import { NotificationBanner } from './NotificationBanner'

/**
 * Auto-change notification banner without props drilling
 */
export const AutoChangeNotificationBanner = () => {
  const {
    itemName,
    newItemCategory,
    autoChangedCategory
  } = useAddItemFormLogic()

  return (
    <NotificationBanner
      type="auto-change"
      message=""
      category={newItemCategory}
      productName={itemName.value}
      isVisible={autoChangedCategory}
    />
  )
}

/**
 * Suggestion notification banner without props drilling
 */
export const SuggestionNotificationBanner = () => {
  const {
    itemName,
    showCategorySuggestion,
    suggestedCategory,
    handleCategorySuggestionAccept,
    handleCategorySuggestionDismiss
  } = useAddItemFormLogic()

  return (
    <NotificationBanner
      type="suggestion"
      message=""
      category={suggestedCategory || undefined}
      productName={itemName.value}
      onAccept={handleCategorySuggestionAccept}
      onDismiss={handleCategorySuggestionDismiss}
      isVisible={showCategorySuggestion && !!suggestedCategory}
    />
  )
}
