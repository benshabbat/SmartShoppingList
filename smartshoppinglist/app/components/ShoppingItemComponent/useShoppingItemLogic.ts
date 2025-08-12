import { ShoppingItem } from '../../types'
import { useUpdateShoppingItem, useDeleteShoppingItem } from '../../hooks/useShoppingItems'

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
  const updateItemMutation = useUpdateShoppingItem()
  const deleteItemMutation = useDeleteShoppingItem()

  // Event handlers
  const handleToggleCart = () => {
    updateItemMutation.mutate({
      id: item.id,
      updates: { isInCart: !item.isInCart }
    })
  }

  const handleRemove = () => {
    deleteItemMutation.mutate(item.id)
  }

  // Computed values
  const isUpdating = updateItemMutation.isPending
  const isDeleting = deleteItemMutation.isPending
  const isLoading = isUpdating || isDeleting

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
    
    // State
    isLoading,
    isUpdating,
    isDeleting,
    
    // Computed values
    textStyle: getTextStyle(),
    showExpiryDate: Boolean(item.expiryDate && variant === 'purchased'),
  }
}
