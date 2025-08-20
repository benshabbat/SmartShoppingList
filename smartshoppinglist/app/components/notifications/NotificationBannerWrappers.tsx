import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { NotificationBanner } from './NotificationBanner'

/**
 * Auto-change notification banner using global context
 */
export const AutoChangeNotificationBanner = () => {
  const {
    itemName,
    newItemCategory,
    autoChangedCategory
  } = useGlobalShopping()

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
 * Suggestion notification banner using global context
 */
export const SuggestionNotificationBanner = () => {
  const {
    itemName,
    showCategorySuggestion,
    suggestedCategory,
    handleCategorySuggestionAccept,
    handleCategorySuggestionDismiss
  } = useGlobalShopping()

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
