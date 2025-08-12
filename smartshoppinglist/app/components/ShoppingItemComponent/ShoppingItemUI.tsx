import { Calendar } from 'lucide-react'
import { ShoppingItem } from '../../types'
import { ItemActions } from '../ItemActions'
import { formatDate } from '../../utils/dateUtils'
import { itemContainerStyles, cn } from '../../utils/classNames'

interface ShoppingItemUIProps {
  item: ShoppingItem
  variant: 'pending' | 'inCart' | 'purchased'
  textStyle: string
  showExpiryDate: boolean
  isLoading: boolean
  onToggleCart: () => void
  onRemove: () => void
}

/**
 * Pure UI component for ShoppingItem
 * Contains only rendering logic, no business logic
 */
export const ShoppingItemUI = ({
  item,
  variant,
  textStyle,
  showExpiryDate,
  isLoading,
  onToggleCart,
  onRemove,
}: ShoppingItemUIProps) => {
  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
      itemContainerStyles[variant],
      isLoading && 'opacity-50 pointer-events-none'
    )}>
      <ItemActions
        variant={variant}
        onToggleCart={onToggleCart}
        onRemove={onRemove}
        disabled={isLoading}
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
