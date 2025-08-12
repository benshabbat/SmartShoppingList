import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'
import { useExpiryDateModalLogic } from './useExpiryDateModalLogic'
import { ExpiryDateModalUI } from './ExpiryDateModalUI'

/**
 * Container component that combines logic and UI
 * Uses global context - NO PROPS DRILLING!
 */
export function ExpiryDateModal() {
  // Get everything from global context - NO PROPS DRILLING!
  const { 
    showExpiryModal, 
    closeExpiryModal, 
    submitExpiryModal,
    checkoutItems 
  } = useGlobalShopping()
  
  // Don't render if not open
  if (!showExpiryModal) return null
  
  const logic = useExpiryDateModalLogic({
    items: checkoutItems,
    onSubmit: submitExpiryModal,
    onClose: closeExpiryModal
  })

  return (
    <ExpiryDateModalUI
      items={checkoutItems}
      isOpen={showExpiryModal}
      expiryDates={logic.expiryDates}
      skippedItems={logic.skippedItems}
      today={logic.today}
      quickDateOptions={logic.quickDateOptions}
      hasAnyDates={logic.hasAnyDates}
      allItemsProcessed={logic.allItemsProcessed}
      onClose={closeExpiryModal}
      onExpiryDateChange={logic.handleExpiryDateChange}
      onSkipItem={logic.handleSkipItem}
      onSubmit={logic.handleSubmit}
      onSkip={logic.handleSkip}
      onQuickDateSet={logic.handleQuickDateSet}
      onSetAllDates={logic.handleSetAllDates}
    />
  )
}
