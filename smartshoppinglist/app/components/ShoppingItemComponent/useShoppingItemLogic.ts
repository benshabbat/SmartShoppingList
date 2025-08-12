import { ShoppingItem } from '../../types'
import { useShoppingListContext } from '../../providers'

interface UseShoppingItemLogicProps {
  item: ShoppingItem
  variant?: 'pending' | 'inCart' | 'purchased'
}

/**
 * Custom hook for ShoppingItem business logic
 * Handles mutations and item operations
 */
export const useShoppingItemLogic = ({ 
  item, 
  variant = 'pending' 
}: UseShoppingItemLogicProps) => {
  const { handleToggleCart, handleRemoveItem } = useShoppingListContext()

  // Event handlers
  const handleToggleCartLocal = () => {
    handleToggleCart(item.id)
  }

  const handleRemove = () => {
    handleRemoveItem(item.id)
  }

  // Computed values
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

  return {
    // Event handlers
    handleToggleCart: handleToggleCartLocal,
    handleRemove,
    
    // Computed values
    textStyle: getTextStyle(),
    showExpiryDate: Boolean(item.expiryDate && variant === 'purchased'),
  }
}
