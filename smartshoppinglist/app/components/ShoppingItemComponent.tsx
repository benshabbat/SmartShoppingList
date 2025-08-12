import { Calendar } from 'lucide-react'
import { ShoppingItem } from '../types'
import { ItemActions } from './ItemActions'
import { formatDate } from '../utils/dateUtils'
import { itemContainerStyles, cn } from '../utils/classNames'

interface ShoppingItemComponentProps {
  item: ShoppingItem
  onToggleCart: (id: string) => void
  onRemove: (id: string) => void
  variant?: 'pending' | 'inCart' | 'purchased'
}

export const ShoppingItemComponent = ({ 
  item, 
  onToggleCart, 
  onRemove, 
  variant = 'pending' 
}: ShoppingItemComponentProps) => {
  const getTextStyle = () => {
    switch (variant) {
      case 'pending':
        return 'font-medium text-gray-800'
      case 'inCart':
        return 'font-medium text-blue-800'
      case 'purchased':
        return 'line-through text-gray-600 font-medium'
      default:
        return 'font-medium text-gray-800'
    }
  }

  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
      itemContainerStyles[variant]
    )}>
      <ItemActions
        variant={variant}
        onToggleCart={() => onToggleCart(item.id)}
        onRemove={() => onRemove(item.id)}
      />
      
      <div className="flex-1 text-right">
        <div className={getTextStyle()}>{item.name}</div>
        {item.expiryDate && variant === 'purchased' && (
          <div className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-1">
            <span>תוקף עד: {formatDate(item.expiryDate)}</span>
            <Calendar className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  )
}
