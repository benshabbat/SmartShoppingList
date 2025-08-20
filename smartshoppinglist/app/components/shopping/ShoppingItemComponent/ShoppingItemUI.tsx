import { Calendar } from 'lucide-react'
import { ShoppingItemUIProps } from '../../../types'
import { ItemActions } from '../actions/ItemActions'
import { formatDate } from '../../../utils/data/dateUtils'
import { itemContainerStyles, cn } from '../../../utils/ui/classNames'
import { useShoppingItemLogic } from './useShoppingItemLogic'

/**
 * UI component for ShoppingItem
 * Zero Props Drilling - gets all actions and logic from context!
 */
export const ShoppingItemUI = ({
  item,
  variant = 'pending',
  isExpanded: _isExpanded,
  onToggleExpansion: _onToggleExpansion
}: ShoppingItemUIProps) => {
  // Get everything from logic hook - no props drilling!
  const {
    textStyle,
    showExpiryDate,
    handleToggleCart,
    handleRemove
  } = useShoppingItemLogic({ item, variant })

  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
      itemContainerStyles[variant]
    )}>
      <ItemActions
        variant={variant}
        onToggleCart={handleToggleCart}
        onRemove={handleRemove}
      />
      
      <div className="flex-1 text-right">
        <div className={textStyle}>{item.name}</div>
        {showExpiryDate && (
          <div className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-1">
            <span>תוקף עד: {formatDate(item.expiryDate!)}</span>
            <Calendar className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  )
}
