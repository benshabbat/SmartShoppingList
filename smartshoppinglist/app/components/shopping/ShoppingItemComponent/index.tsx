import { ShoppingItemComponentProps } from '../../../types'
import { ShoppingItemUI } from './ShoppingItemUI'

/**
 * Container component - Zero Props Drilling for actions!
 * Only item data is passed, all actions come from context
 */
export const ShoppingItemComponent = ({ 
  item, 
  variant = 'pending',
  isExpanded,
  onToggleExpansion
}: ShoppingItemComponentProps) => {
  return (
    <ShoppingItemUI
      item={item}
      variant={variant}
      isExpanded={isExpanded}
      onToggleExpansion={onToggleExpansion}
    />
  )
}
