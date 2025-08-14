import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { AutoComplete } from './AutoComplete'

/**
 * AutoCompleteWrapper - Pure component using global context
 */
export const AutoCompleteWrapper = () => {
  const {
    itemName,
    newItemCategory,
    smartSuggestions,
    autoChangedCategory,
    purchaseHistory,
    handleAutoCompleteSelect
  } = useGlobalShopping()

  return (
    <AutoComplete
      value={itemName.value}
      onChange={itemName.onChange}
      onSelect={handleAutoCompleteSelect}
      suggestions={smartSuggestions}
      purchaseHistory={purchaseHistory}
      placeholder={`הוסף ${newItemCategory}...`}
      className="flex-1"
      autoChangedCategory={autoChangedCategory}
    />
  )
}
