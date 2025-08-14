import { Plus } from 'lucide-react'
import { CategorySelector } from '../CategorySelector'
import { AutoCompleteWrapper } from '../AutoCompleteWrapper'
import { AutoChangeNotificationBanner, SuggestionNotificationBanner } from '../NotificationBannerWrappers'
import { getButtonClasses, containerStyles } from '../../utils/classNames'
import { useAddItemFormLogic } from './useAddItemFormLogic'

/**
 * Pure UI component for AddItemForm
 * NO PROPS DRILLING - everything comes from global context!
 */
export const AddItemFormUI = () => {
  // NO PROPS DRILLING! Only get what's needed for this component
  const {
    isSubmitDisabled,
    handleSubmit
  } = useAddItemFormLogic()
  return (
    <div className={containerStyles.section}>
      <AutoChangeNotificationBanner />
      <SuggestionNotificationBanner />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <CategorySelector />
          </div>
        </div>
        
        <div className="flex gap-3">
          <AutoCompleteWrapper />
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
