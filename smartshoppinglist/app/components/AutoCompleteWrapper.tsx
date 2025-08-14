import { useAddItemFormLogic } from './AddItemForm/useAddItemFormLogic'
import { useGlobalShopping } from '../contexts/GlobalShoppingContext'
import { AutoComplete } from './AutoComplete'

/**
 * AutoCompleteWrapper without props drilling - uses context directly
 */
export const AutoCompleteWrapper = () => {
  const { purchaseHistory } = useGlobalShopping()
  const {
    itemName,
    newItemCategory,
    suggestions,
    autoChangedCategory,
    handleNameChange,
    handleAutoCompleteSelect
  } = useAddItemFormLogic()

  return (
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
  )
}
