import { ShoppingItem } from '../../types'
import { useExpiryDateModalLogic } from './useExpiryDateModalLogic'
import { ExpiryDateModalUI } from './ExpiryDateModalUI'

interface ExpiryDateModalProps {
  items: ShoppingItem[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (itemsWithExpiry: Array<{ id: string; expiryDate?: Date }>) => void
}

/**
 * Container component that combines logic and UI
 * Follows the Container/Presentational pattern
 */
export function ExpiryDateModal({ 
  items, 
  isOpen, 
  onClose, 
  onSubmit 
}: ExpiryDateModalProps) {
  const logic = useExpiryDateModalLogic({
    items,
    onSubmit,
    onClose
  })

  return (
    <ExpiryDateModalUI
      items={items}
      isOpen={isOpen}
      expiryDates={logic.expiryDates}
      skippedItems={logic.skippedItems}
      today={logic.today}
      quickDateOptions={logic.quickDateOptions}
      hasAnyDates={logic.hasAnyDates}
      allItemsProcessed={logic.allItemsProcessed}
      onClose={onClose}
      onExpiryDateChange={logic.handleExpiryDateChange}
      onSkipItem={logic.handleSkipItem}
      onSubmit={logic.handleSubmit}
      onSkip={logic.handleSkip}
      onQuickDateSet={logic.handleQuickDateSet}
      onSetAllDates={logic.handleSetAllDates}
    />
  )
}
