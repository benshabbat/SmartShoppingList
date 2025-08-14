import { ShoppingItem, ShoppingItemComponentProps } from '../../types'
import { ShoppingItemUI } from './ShoppingItemUI'

/**
 * Container component - Zero Props Drilling for actions!
 * Only item data is passed, all actions come from context
 */
export const ShoppingItemComponent = ({ 
  item, 
  variant = 'pending' 
}: ShoppingItemComponentProps) => {
  return (
    <ShoppingItemUI
      item={item}
      variant={variant}
    />
  )
}
