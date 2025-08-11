import { ShoppingBag, X, Check, Calendar, Plus, ShoppingCart } from 'lucide-react'
import { ShoppingItem } from '../types'
import { formatDate } from '../utils/helpers'

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
  const getVariantStyles = () => {
    switch (variant) {
      case 'pending':
        return {
          container: 'bg-gray-50 hover:bg-gray-100 border border-gray-200',
          button: 'flex items-center gap-2 px-4 py-2 border-2 border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-md text-blue-600 hover:text-blue-700',
          buttonText: 'הוסף לסל',
          icon: 'w-5 h-5',
          text: 'font-medium text-gray-800'
        }
      case 'inCart':
        return {
          container: 'bg-blue-50 hover:bg-blue-100 border border-blue-200',
          button: 'flex items-center gap-2 px-4 py-2 border-2 border-blue-500 rounded-xl bg-blue-500 hover:bg-blue-600 shadow-md text-white',
          buttonText: 'בסל',
          icon: 'w-5 h-5',
          text: 'font-medium text-blue-800'
        }
      case 'purchased':
        return {
          container: 'bg-green-50 hover:bg-green-100 border border-green-200',
          button: 'flex items-center gap-2 px-4 py-2 border-2 border-green-500 rounded-xl bg-green-500 shadow-md text-white',
          buttonText: 'נקנה',
          icon: 'w-5 h-5',
          text: 'line-through text-gray-600 font-medium'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${styles.container}`}>
      <button
        onClick={() => onToggleCart(item.id)}
        className={styles.button}
      >
        {variant === 'purchased' ? (
          <>
            <Check className={styles.icon} />
            <span className="text-sm font-medium">{styles.buttonText}</span>
          </>
        ) : variant === 'inCart' ? (
          <>
            <ShoppingCart className={styles.icon} />
            <span className="text-sm font-medium">{styles.buttonText}</span>
          </>
        ) : (
          <>
            <Plus className={styles.icon} />
            <span className="text-sm font-medium">{styles.buttonText}</span>
          </>
        )}
      </button>
      
      <div className="flex-1 text-right">
        <div className={styles.text}>{item.name}</div>
        {item.expiryDate && variant === 'purchased' && (
          <div className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-1">
            <span>תוקף עד: {formatDate(item.expiryDate)}</span>
            <Calendar className="w-3 h-3" />
          </div>
        )}
      </div>
      
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
        title="הסר מוצר"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
