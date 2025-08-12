import { ShoppingItem } from '../../types'
import { useShoppingItemLogic } from './useShoppingItemLogic'
import { ShoppingItemUI } from './ShoppingItemUI'

interface ShoppingItemComponentProps {
  item: ShoppingItem
  variant?: 'pending' | 'inCart' | 'purchased'
}

/**
 * Container component that combines logic and UI
 * Follows the Container/Presentational pattern
 */
export const ShoppingItemComponent = ({ 
  item, 
  variant = 'pending' 
}: ShoppingItemComponentProps) => {
  const logic = useShoppingItemLogic({ item, variant })

  return (
    <ShoppingItemUI
      item={item}
      variant={variant}
      textStyle={logic.textStyle}
      showExpiryDate={logic.showExpiryDate}
      isLoading={logic.isLoading}
      onToggleCart={logic.handleToggleCart}
      onRemove={logic.handleRemove}
    />
  )
}
