import { ShoppingItem, UseShoppingItemLogicProps } from '../../types'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'

/**
 * Custom hook for ShoppingItem business logic
 * Uses global context - NO PROPS DRILLING!
 */
export const useShoppingItemLogic = ({ 
  item, 
  variant = 'pending' 
}: UseShoppingItemLogicProps) => {
  // Get everything we need from global context - no props!
  const { toggleItemInCart, removeItem } = useGlobalShopping()

  // Event handlers
  const handleToggleCart = () => {
    toggleItemInCart(item.id)
  }

  const handleRemove = () => {
    removeItem(item.id)
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
    handleToggleCart,
    handleRemove,
    
    // Computed values
    textStyle: getTextStyle(),
    showExpiryDate: Boolean(item.expiryDate && variant === 'purchased'),
  }
}
