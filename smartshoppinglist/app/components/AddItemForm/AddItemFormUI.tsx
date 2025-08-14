import { Plus } from 'lucide-react'
import { CATEGORIES } from '../../constants'
import { AutoComplete } from '../AutoComplete'
import { CategorySelector } from '../CategorySelector'
import { NotificationBanner } from '../NotificationBanner'
import { getButtonClasses, containerStyles } from '../../utils/classNames'
import { useAddItemFormLogic } from './useAddItemFormLogic'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'

/**
 * Pure UI component for AddItemForm
 * NO PROPS DRILLING - everything comes from global context!
 */
export const AddItemFormUI = () => {
  // NO PROPS DRILLING! Get everything from global context and hooks
  const { purchaseHistory } = useGlobalShopping()
  const {
    itemName,
    newItemCategory,
    suggestions,
    autoChangedCategory,
    showCategorySuggestion,
    suggestedCategory,
    isSubmitDisabled,
    handleSubmit,
    handleAutoCompleteSelect,
    handleNameChange,
    handleCategorySuggestionAccept,
    handleCategorySuggestionDismiss,
    setNewItemCategory
  } = useAddItemFormLogic()
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
        onAccept={handleCategorySuggestionAccept}
        onDismiss={handleCategorySuggestionDismiss}
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
            className={getButtonClasses('primary', 'md', isSubmitDisabled)}
            disabled={isSubmitDisabled}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
