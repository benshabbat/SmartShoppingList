import { Plus } from 'lucide-react'
import { CategorySelector } from '../CategorySelector'
import { AutoCompleteWrapper } from '../AutoCompleteWrapper'
import { AutoChangeNotificationBanner, SuggestionNotificationBanner } from '../NotificationBannerWrappers'
import { getButtonClasses, containerStyles } from '../../utils/classNames'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'

/**
 * Pure UI component for AddItemForm
 * ZERO PROPS DRILLING - everything managed by global context!
 */
export const AddItemFormUI = () => {
  // Only get what this specific component needs
  const {
    itemName,
    handleAddItemSubmit
  } = useGlobalShopping()

  return (
    <div className={containerStyles.section}>
      <AutoChangeNotificationBanner />
      <SuggestionNotificationBanner />

      <form onSubmit={handleAddItemSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <CategorySelector />
          </div>
        </div>
        
        <div className="flex gap-3">
          <AutoCompleteWrapper />
          <button
            type="submit"
            className={getButtonClasses('primary', 'md', !itemName.isValid || !itemName.value.trim())}
            disabled={!itemName.isValid || !itemName.value.trim()}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
