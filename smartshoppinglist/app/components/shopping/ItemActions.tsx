import { Check, ArrowRight, Plus, X } from 'lucide-react'
import { ItemActionsProps } from '../../types'

export const ItemActions: React.FC<ItemActionsProps> = ({
  variant,
  onToggleCart,
  onRemove,
  className = '',
  disabled = false
}) => {
  const getActionConfig = () => {
    switch (variant) {
      case 'pending':
        return {
          toggleButton: {
            className: 'flex items-center gap-2 px-4 py-2 border-2 border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-md text-blue-600 hover:text-blue-700',
            text: 'הוסף לסל',
            icon: <Plus className="w-5 h-5" />
          }
        }
      case 'inCart':
        return {
          toggleButton: {
            className: 'flex items-center gap-2 px-4 py-2 border-2 border-orange-500 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-md text-white',
            text: 'חזרה לרשימה',
            icon: <ArrowRight className="w-5 h-5" />
          }
        }
      case 'purchased':
        return {
          toggleButton: {
            className: 'flex items-center gap-2 px-4 py-2 border-2 border-green-500 rounded-xl bg-green-500 shadow-md text-white',
            text: 'נקנה',
            icon: <Check className="w-5 h-5" />
          }
        }
      default:
        return {
          toggleButton: {
            className: 'flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-gray-500 hover:bg-gray-50 transition-all text-gray-600',
            text: 'פעולה',
            icon: <Plus className="w-5 h-5" />
          }
        }
    }
  }

  const config = getActionConfig()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onToggleCart}
        className={config.toggleButton.className}
        disabled={disabled}
      >
        {config.toggleButton.icon}
        <span className="text-sm font-medium">{config.toggleButton.text}</span>
      </button>
      
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
        title="הסר מוצר"
        disabled={disabled}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
