import { Plus } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'
import { ShoppingItem, Category } from '../../types'
import { AutoComplete } from '../AutoComplete'
import { CategorySelector } from '../CategorySelector'
import { NotificationBanner } from '../NotificationBanner'
import { getButtonClasses, containerStyles } from '../../utils/classNames'

interface AddItemFormUIProps {
  // Form data
  itemName: {
    value: string
    error?: string
    isValid: boolean
  }
  newItemCategory: Category
  suggestions: string[]
  
  // UI state
  autoChangedCategory: boolean
  showCategorySuggestion: boolean
  suggestedCategory: Category | null
  isSubmitDisabled: boolean
  
  // Event handlers
  onSubmit: (e: React.FormEvent) => void
  onAutoCompleteSelect: (selectedItem: string) => void
  onNameChange: (name: string) => void
  onCategorySuggestionAccept: () => void
  onCategorySuggestionDismiss: () => void
  onCategoryChange: (category: Category) => void
  
  // Props
  purchaseHistory: ShoppingItem[]
}

/**
 * Pure UI component for AddItemForm
 * Contains only rendering logic, no business logic
 */
export const AddItemFormUI = ({
  itemName,
  newItemCategory,
  suggestions,
  autoChangedCategory,
  showCategorySuggestion,
  suggestedCategory,
  isSubmitDisabled,
  onSubmit,
  onAutoCompleteSelect,
  onNameChange,
  onCategorySuggestionAccept,
  onCategorySuggestionDismiss,
  onCategoryChange,
  purchaseHistory,
}: AddItemFormUIProps) => {
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
        onAccept={onCategorySuggestionAccept}
        onDismiss={onCategorySuggestionDismiss}
        isVisible={showCategorySuggestion && !!suggestedCategory}
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <CategorySelector
              value={newItemCategory}
              onChange={onCategoryChange}
              categories={CATEGORIES}
              isHighlighted={autoChangedCategory}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <AutoComplete
            value={itemName.value}
            onChange={onNameChange}
            onSelect={onAutoCompleteSelect}
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
